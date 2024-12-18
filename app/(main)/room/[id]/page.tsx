'use client';

import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {v4 as uuid} from "uuid";

const URL_WEB_SOCKET = 'ws://b35d-2a03-4b80-c300-1cb0-a47a-6820-875-8b9f.ngrok-free.app/';

export default function Room() {

    const userId = useRef(uuid());
    const ws = useRef({} as any);

    useEffect(() => {
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
    }, []);

    const sendWSMsg = (data) => {
        console.log('socket send message', data);
        ws.current.send(JSON.stringify({channelName: '1', userId: userId.current, ...data}));
    };

    const [waitCall, setWaitCall] = useState(false);

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