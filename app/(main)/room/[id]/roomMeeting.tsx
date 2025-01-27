'use client';

import {useEffect, useRef, useState} from "react";
import {v4 as uuid} from "uuid";
import {LoadingSpinner} from "@/components/ui/spinner";
import {RoomUserClient} from "@/app/(main)/room/[id]/roomUserClient";
import SidePanel from "@/components/chat/sidePanel";
import ActionButtons from "@/components/chat/actionButtons";
import {RoomMessage, RoomMessageResponse} from "@/lib/interfaces";
import axios from "axios";
import {useAuth} from "@/components/hooks/useAuth";

const URL_WEB_SOCKET = 'https://e44a-2a03-4b80-c300-1cb0-6dc7-4bc-ff57-64bc.ngrok-free.app/';
const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
let roomUserClient: RoomUserClient [] = [];

export default function RoomMeeting(props: {id: string}) {

    const { user, isAuthenticated } = useAuth();
    const [roomUsers, setRoomUsers] = useState<RoomUserClient []>([]);
    const [granted, setGranted] = useState(null);
    const userId = useRef(uuid());
    const ws = useRef({} as any);
    const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
    const [messages, setMessages] = useState<RoomMessage []>([]);

    const onMessageSend = (message: string) => {
        sendWSMsg({type: 'message_send', message: message});
        setMessages((prevMessages) => [...prevMessages, {message: message, user: {id: userId.current, name: window['user']?.name}, date: new Date()}]);
    }

    const fetchMessages = async () => {
        try {
            const response = await axios.get<RoomMessageResponse>(`/api/room/${props.id}/messages`);
            const messages = response.data.messages;
            messages.forEach((message) => {
                message.date = new Date(message.date);
            });
            setMessages((prevMessages) => [...messages, ...prevMessages]);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
    }, [messages]);

    const toggleSidePanel = () => {
        setIsSidePanelVisible(!isSidePanelVisible);
    };

    useEffect(() => {
    }, [roomUsers]);

    const handlePermissions = async ():Promise<'granted' | any> => {
        try {
            const camResult = await navigator.permissions.query({ name: "camera" });
            const miceResult = await navigator.permissions.query({ name: "microphone" });
            camResult.onchange = () => {
                handlePermissions();
            };
            miceResult.onchange = () => {
                handlePermissions();
            };
            if (camResult.state === 'granted' && miceResult.state === 'granted') {
                setGranted('granted')
                if(!window['started']) {
                    startSocket();
                    fetchMessages();
                    window['started'] = true;
                }

            } else if (camResult.state === 'prompt' || miceResult.state === 'prompt') {
                setGranted('prompt')
            } else {
                setGranted('denied')
                window['started'] = false;
                ws.current?.close?.();
            }

        } catch (error) {
            setGranted('denied')
            ws.current?.close?.();
        }

    }

    useEffect(()=> {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(res => {

        }).catch(() => {});
        (async () => {
            await handlePermissions();
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
            ws.current = wsClient;
            joinRoom();
            setupDevice();
        };
        wsClient.onclose = () => console.log('ws closed');
        wsClient.onmessage = async (message) => {
            const parsedMessage = JSON.parse(message.data);
            switch (parsedMessage.type) {
                case 'joined': {
                    const newJoinedUserId = parsedMessage.userId;
                    const allJoinedUsers = parsedMessage.users.filter(user => user.id !== userId.current);
                    if (!roomUserClient.length) {
                        roomUserClient = allJoinedUsers.map(user => ({id: user.id, name: user.name, peerConnection: null}));
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
                    setTimeout(() => setRoomUsers([...roomUserClient]),500);
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
                    break;
                }
                case 'offer_sdp_received': {
                    const {sdp, userId} = parsedMessage;
                    const callerUser = roomUserClient.find(user => user.id === userId);
                    onAnswer(callerUser, sdp);
                    break;
                }
                case 'answer_sdp': {
                    const {sdp, userId} = parsedMessage;
                    const user = roomUserClient.find(user => user.id === userId);
                    user.peerConnection.setRemoteDescription(sdp);
                    break;
                }
                case 'message_received': {
                    const {message, senderId, name} = parsedMessage;
                    if (userId.current === senderId)
                        return;
                    setMessages((prevMessages) => [...prevMessages, {message: message, user: {id: senderId, name: name}, date: new Date()}]);
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
        ws.current.send(JSON.stringify({roomId: props.id, userId: userId.current, ...data}));
    };

    let localStream;


    async function makeCall(joinedUser: RoomUserClient) {
        joinedUser.peerConnection = new RTCPeerConnection(configuration);
        joinedUser.peerConnection.onicecandidate = (event) => {

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
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
            const localPlayer = document.getElementById('localPlayer') as HTMLVideoElement;
            localPlayer.srcObject = stream;
            localStream = stream;
        }, (error) => {
            console.error('getUserMedia error:', error);
        });
    };

    const gotRemoteStream = (event, user: RoomUserClient) => {
        const remotePlayer = document.getElementById(`${user.id}video`);
        if (event.stream) {
            remotePlayer.srcObject = event.stream;
        } else {
            setTimeout(() => gotRemoteStream(event, user), 2000);
        }
    };

    const joinRoom = () => {
        sendWSMsg({type: 'join', name: window['user']?.name || 'No Name given'});
    }

    const onAnswer = (callerUser: RoomUserClient, sdpOffer) => {

        callerUser.peerConnection = new RTCPeerConnection(configuration);
        callerUser.peerConnection.onicecandidate = (event) => {
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
                <p className='text-center'>My Stream: {user?.name}</p>
                <video id="localPlayer" autoPlay style={{width: 640, height: 480}}/>
            </div>

            <div className='flex flex-1 overflow-auto'>
                {
                    roomUsers.map((roomUser: RoomUserClient) => (
                        <div key={roomUser.id}>
                            <p>User Name: {roomUser.name}</p>
                            <p>Connection ID: {roomUser.id}</p>
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