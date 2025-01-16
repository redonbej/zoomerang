'use client';

import {useEffect, useRef, useState} from "react";
import {v4 as uuid} from "uuid";
import {LoadingSpinner} from "@/components/ui/spinner";
import {RoomUserClient} from "@/app/(main)/room/[id]/roomUserClient";
import SidePanel from "@/components/chat/sidePanel";
import ActionButtons from "@/components/chat/actionButtons";
import {RoomMessage, RoomMessageResponse} from "@/lib/interfaces";
import axios from "axios";

const URL_WEB_SOCKET = 'https://e44a-2a03-4b80-c300-1cb0-6dc7-4bc-ff57-64bc.ngrok-free.app/';
const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
let roomUserClient: RoomUserClient [] = [];

export default function RoomMeeting(props: {id: string}) {

    const [roomUsers, setRoomUsers] = useState<RoomUserClient []>([]);
    const [granted, setGranted] = useState(null);
    const userId = useRef(uuid());
    const ws = useRef({} as any);
    const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
    const [messages, setMessages] = useState<RoomMessage []>([]);

    const onMessageSend = (message: string) => {
        console.log(message)
        sendWSMsg({type: 'message_send', message: message});
        setMessages((prevMessages) => [...prevMessages, {message: message, user: {id: userId.current}, date: new Date()}]);
    }

    const fetchMessages = async () => {
        try {
            const response = await axios.get<RoomMessageResponse>(`/api/room/${props.id}/messages`);
            const messages = response.data.messages;
            console.log('response', response.data)
            messages.forEach((message) => {
                message.date = new Date(message.date);
            });
            setMessages((prevMessages) => [...messages, ...prevMessages]);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        console.log(messages);
    }, [messages]);

    const toggleSidePanel = () => {
        setIsSidePanelVisible(!isSidePanelVisible);
    };

    useEffect(() => {
        console.log(roomUsers);
    }, [roomUsers]);

    const handlePermissions = async ():Promise<'granted' | any> => {
        try {
            const camResult = await navigator.permissions.query({ name: "camera" });
            const miceResult = await navigator.permissions.query({ name: "microphone" });
            camResult.onchange = () => {
                console.log('on change camera: ',camResult)
                handlePermissions();
            };
            miceResult.onchange = () => {
                console.log('on change mice:', miceResult)
                handlePermissions();
            };
            console.log(camResult, miceResult);
            if (camResult.state === 'granted' && miceResult.state === 'granted') {
                setGranted('granted')
                console.log('granted');
                startSocket();
                fetchMessages();
            } else if (camResult.state === 'prompt' || miceResult.state === 'prompt') {
                setGranted('prompt')
                console.log('prompt')
            } else {
                setGranted('denied')
                console.log('denied')
                ws.current?.close?.();
            }

        } catch (error) {
            console.log(error);
            setGranted('denied')
            console.log('denied')
            ws.current?.close?.();
        }

    }

    useEffect(()=> {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(res => {

        }).catch(() => {});
        (async () => {
            await handlePermissions();
            console.log(granted)
        })();
        clearInterval(window['socketInterval'])
        window['socketInterval'] = setInterval(() => {
            ws?.current?.send?.(JSON.stringify({type: 'ping'}));
        }, 2000)
    }, [])

    const startSocket = () => {
        roomUserClient = [];
        const wsClient = new WebSocket(URL_WEB_SOCKET);
        wsClient.onopen = () => {
            console.log('Socket opened');
            ws.current = wsClient;
            joinRoom();
            setupDevice();
        };
        wsClient.onclose = () => console.log('ws closed');
        wsClient.onmessage = async (message) => {
            //console.log('socket got data', message.data);
            const parsedMessage = JSON.parse(message.data);
            switch (parsedMessage.type) {
                case 'joined': {
                    const newJoinedUserId = parsedMessage.userId;
                    const allUsersId = parsedMessage.users.filter(id => id !== userId.current);
                    console.log('my room users', roomUserClient)
                    if (!roomUserClient.length) {
                        roomUserClient = allUsersId.map(id => ({id: id, peerConnection: null}));
                        console.log('adding users', roomUserClient);
                        setRoomUsers(roomUserClient)
                    }
                    if (userId.current === newJoinedUserId)
                        return;
                    const newJoinedUser = roomUserClient.find(user => user.id === newJoinedUserId);
                    if (newJoinedUser) {
                        makeCall(newJoinedUser)
                    } else {
                        const newUser = {id: newJoinedUserId, peerConnection: null};
                        roomUserClient.push(newUser)
                        makeCall(newUser)
                        setRoomUsers([...roomUserClient]);
                    }
                    console.log(roomUserClient)
                    break;
                }
                case 'left': {
                    const leftUserId = parsedMessage.userId;
                    const leftUser = roomUserClient.find(user => user.id === leftUserId);
                    if (!leftUser)
                        return;

                    leftUser.peerConnection?.close();
                    roomUserClient = roomUserClient.filter(user => user.id !== leftUserId);
                    setRoomUsers([...roomUserClient]);
                    console.log(`Removed user: ${leftUserId} from Room: ${props.id}`)
                    break;
                }
                case 'offer_sdp_received': {
                    const {sdp, userId} = parsedMessage;
                    console.log('offer sdp back, msg', parsedMessage)
                    const callerUser = roomUserClient.find(user => user.id === userId);
                    console.log(callerUser);
                    onAnswer(callerUser, sdp);
                    break;
                }
                case 'answer_sdp': {
                    const {sdp, userId} = parsedMessage;
                    console.log('userId', userId, roomUserClient)
                    const user = roomUserClient.find(user => user.id === userId);
                    console.log('Answer SDP:', sdp);
                    user.peerConnection.setRemoteDescription(sdp);
                    break;
                }
                case 'message_received': {
                    const {message, senderId} = parsedMessage;
                    if (userId.current === senderId)
                        return;
                    setMessages((prevMessages) => [...prevMessages, {message: message, user: {id: senderId}, date: new Date()}]);
                    break;
                }
                case 'quit': {
                    break;
                }
                default:
                    break;
            }
        };
        return () => {
            wsClient.close();
        };
    }

    const sendWSMsg = (data) => {
        console.log('socket send message', data, 'my id:', userId.current);
        ws.current.send(JSON.stringify({roomId: props.id, userId: userId.current, ...data}));
    };

    let localStream;


    async function makeCall(joinedUser: RoomUserClient) {
        joinedUser.peerConnection = new RTCPeerConnection(configuration);
        joinedUser.peerConnection.onicecandidate = (event) => {
            //console.log('ICE Candidate Offer', event.candidate, joinedUser.peerConnection.localDescription);

            if (!event.candidate) {
                const offer = joinedUser.peerConnection.localDescription;
                sendWSMsg({type: 'send_offer', sdp: offer, offerToUserId: joinedUser.id});
            }
        };;
        joinedUser.peerConnection.onaddstream = (event) => gotRemoteStream(event, joinedUser);
        if (!localStream) {
            setTimeout(() => {joinedUser.peerConnection.addStream(localStream)}, 2000)
        } else {
            joinedUser.peerConnection.addStream(localStream);
        }
        const offer = await joinedUser.peerConnection.createOffer();
        await joinedUser.peerConnection.setLocalDescription(offer);
    }

    const setupDevice = () => {
        console.log('setupDevice invoked');
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
            // render local stream on DOM
            console.log('got user stream')
            const localPlayer = document.getElementById('localPlayer') as HTMLVideoElement;
            localPlayer.srcObject = stream;
            localStream = stream;
        }, (error) => {
            console.error('getUserMedia error:', error);
        });
    };

    const gotRemoteStream = (event, user: RoomUserClient) => {
        console.log(`Setting remote stream for ${user.id}`);
        const remotePlayer = document.getElementById(`${user.id}video`);
        if (event.stream) {
            remotePlayer.srcObject = event.stream;
        } else {
            console.log('too soon, reinvoke');
            setTimeout(() => gotRemoteStream(event, user), 2000);
        }
    };

    const joinRoom = () => {
        sendWSMsg({type: 'join'});
    }

    const onAnswer = (callerUser: RoomUserClient, sdpOffer) => {
        console.log('Answering Offer');

        callerUser.peerConnection = new RTCPeerConnection(configuration);
        callerUser.peerConnection.onicecandidate = (event) => {
            //console.log('ICE Candidate Answer', event.candidate, callerUser.peerConnection.localDescription);
            if (!event.candidate) {
                const answer = callerUser.peerConnection.localDescription;
                sendWSMsg({type: 'send_answer', sdp: answer, answerToUserId: callerUser.id});
            }
        };
        callerUser.peerConnection.onaddstream = (event) => gotRemoteStream(event, callerUser);
        if (localStream && localStream instanceof MediaStream)
            callerUser.peerConnection.addStream(localStream);
        callerUser.peerConnection.setRemoteDescription(sdpOffer);
        callerUser.peerConnection.createAnswer().then(answer => {
            callerUser.peerConnection.setLocalDescription(answer);
        });
    };

    if (!granted) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <div>
                    <p className='text-center font-semibold'>Loading</p>
                    <LoadingSpinner style={{width: '400px', height: '400px'}}>this is Loading</LoadingSpinner>
                </div>
            </div>
        )
    }

    if (granted === 'denied') {
        return (
            <div className="fixed bg-black/50 h-full w-full flex items-center justify-center">
                <div className='max-w-[400px] p-5 rounded-2xl shadow bg-white'>
                    This app needs Camera and Microphone Permissions in order to function properly. Please enable them and app will resume working
                </div>
            </div>
        )
    }

    if (granted === 'prompt') {
        return (
            <div className="fixed bg-black/50 h-full w-full flex items-center justify-center">
                <div className='max-w-[400px] p-5 rounded-2xl shadow bg-white'>
                    Please accept the Permissions from the browser
                </div>
            </div>
        )
    }


    return (<>
        <div className='h-full w-full p-2.5 flex flex-col'>
            <div className="flex flex-col md:flex-row w-full justify-between">
                <h3 className='text-xl font-semibold'>Connected User: {userId.current}</h3>
                <ActionButtons toggleSidePanel={toggleSidePanel}/>
            </div>

            <div className='mt-10 flex flex-col items-center'>
                <p className='text-center'>My Stream</p>
                <video id="localPlayer" autoPlay style={{width: 640, height: 480}}/>
            </div>

            <div className='flex flex-1 overflow-auto'>
                {
                    roomUsers.map((roomUser: RoomUserClient) => (
                        <div key={roomUser.id}>
                            <p>User: {roomUser.id}</p>
                            <video id={roomUser.id + 'video'} autoPlay style={{height: '240px'}} className='mr-10'></video>
                        </div>
                    ))
                }
            </div>

            <div
                className={`fixed w-96 top-12 bottom-14 bg-white shadow-lg rounded-md transition-all duration-300
           ease-in-out ${isSidePanelVisible ? "translate-x-0 right-4" : "translate-x-full right-0"}`}
            >
                <SidePanel toggleSidePanel={toggleSidePanel} messages={messages} setMessages={setMessages} onMessageSend={onMessageSend}/>
            </div>
        </div>
    </>)

}