'use client';

import {useParams} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {v4 as uuid} from "uuid";
import {Button} from "@/components/ui/button";
import {LoadingSpinner} from "@/components/ui/spinner";

const URL_WEB_SOCKET = 'ws://localhost:3001';

export default function RoomMeeting(props: {id: string}) {

    const [granted, setGranted] = useState(null);
    const userId = useRef(uuid());
    const ws = useRef({} as any);

    const handlePermissions = async ():Promise<'granted' | any> => {
        try {
            const camResult = await navigator.permissions.query({ name: "camera" });
            const miceResult = await navigator.permissions.query({ name: "microphone" });
            camResult.onchange = () => {
                console.log(camResult)
                handlePermissions();
            };
            miceResult.onchange = () => {
                console.log(miceResult)
                handlePermissions();
            };
            console.log(camResult, miceResult);
            if (camResult.state === 'granted' && miceResult.state === 'granted') {
                setGranted('granted')
                console.log('granted');
                startSocket();

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

    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(res => {

        }).catch(() => {});
        (async () => {
            await handlePermissions();
            console.log(granted)
        })();
    }, [])

    const startSocket = () => {
        const wsClient = new WebSocket(URL_WEB_SOCKET);
        wsClient.onopen = () => {
            console.log('ws opened');
            ws.current = wsClient;
            joinRoom();
            setupDevice();
        };
        wsClient.onclose = () => console.log('ws closed');
        wsClient.onmessage = async (message) => {
            console.log('socket got data', message, message.data);
            const parsedMessage = JSON.parse(message.data);
            switch (parsedMessage.type) {
                case 'joined': {
                    const body = parsedMessage.body;
                    console.log('users in this channel', body);
                    break;
                }
                case 'offer_sdp_received': {
                    const offer = parsedMessage.body;
                    onAnswer(offer);
                    break;
                }
                case 'answer_sdp_received': {
                    gotRemoteDescription(parsedMessage.body);
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
        console.log('socket send message', data);
        ws.current.send(JSON.stringify({channelName: props.id, userId: userId.current, ...data}));
    };

    let localStream;
    let peerConnection;
    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}

    async function makeCall() {
        peerConnection = new RTCPeerConnection(configuration);
        peerConnection.onicecandidate = gotLocalIceCandidateOffer;
        peerConnection.onaddstream = gotRemoteStream;
        peerConnection.addStream(localStream);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
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

    const gotRemoteStream = (event) => {
        console.log('gotRemoteStream invoked');
        const remotePlayer = document.getElementById('remotePlayer');
        if (event.stream)
            remotePlayer.srcObject = event.stream;
    };

    // async function to handle ice candidates
    const gotLocalIceCandidateOffer = (event) => {
        console.log('gotLocalIceCandidateOffer invoked', event.candidate, peerConnection.localDescription);
        // when gathering candidate finished, send complete sdp
        if (!event.candidate) {
            const offer = peerConnection.localDescription;
            // send offer sdp to signaling server via websocket
            sendWSMsg({type: 'send_offer', sdp: offer});
        }
    };

    const joinRoom = () => {
        sendWSMsg({type: 'join'});
    }

    const onAnswer = (offer) => {
        console.log('onAnswer invoked');

        if (localStream.getVideoTracks().length > 0) {
            console.log(`Using video device: ${localStream.getVideoTracks()[0].label}`);
        }
        if (localStream.getAudioTracks().length > 0) {
            console.log(`Using audio device: ${localStream.getAudioTracks()[0].label}`);
        }
        peerConnection = new RTCPeerConnection(configuration);
        peerConnection.onicecandidate = gotLocalIceCandidateAnswer;
        peerConnection.onaddstream = gotRemoteStream;
        peerConnection.addStream(localStream);
        peerConnection.setRemoteDescription(offer);
        peerConnection.createAnswer().then(gotAnswerDescription);
    };

    const gotAnswerDescription = (answer) => {
        console.log('gotAnswerDescription invoked:', answer);
        peerConnection.setLocalDescription(answer);
    };

    const gotLocalIceCandidateAnswer = (event) => {
        console.log('gotLocalIceCandidateAnswer invoked', event.candidate, peerConnection.localDescription);
        // gathering candidate finished, send complete sdp
        if (!event.candidate) {
            const answer = peerConnection.localDescription;
            sendWSMsg({type: 'send_answer', sdp: answer});
        }
    };


    const gotRemoteDescription = (answer) => {
        console.log('gotRemoteDescription invoked:', answer);
        peerConnection.setRemoteDescription(answer);
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
        {/*<input placeholder="User ID" onchange={(e) => setUserId(e.target.value)} />*/}
        <Button onClick={setupDevice}>Start stream</Button>
        <Button onClick={makeCall}>Make Call</Button>
        {/*<Button onClick={waitForCall}></Button>*/}
        <div className='flex p-2.5'>
            <video
                id="peerPlayer"
                autoPlay
                style={{width: 640, height: 480}}
            />
            <video
                id="localPlayer"
                autoPlay
                style={{width: 640, height: 480}}
            />
            <video
                id="remotePlayer"
                autoPlay
                style={{width: 640, height: 480}}
            />
        </div>
    </>)

}