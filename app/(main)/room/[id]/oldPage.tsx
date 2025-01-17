'use client';

import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {v4 as uuid} from "uuid";

const URL_WEB_SOCKET = 'ws://localhost:3001';

export default function Room() {

    const userId = useRef(uuid());
    const ws = useRef({} as any);

    useEffect(() => {
        const wsClient = new WebSocket(URL_WEB_SOCKET);
        wsClient.onopen = () => {
            ws.current = wsClient;
            joinRoom();
        };
        wsClient.onclose = () => console.log('ws closed');
        wsClient.onmessage = async (message) => {
            if (message.data.answer) {
                const remoteDesc = new RTCSessionDescription(message.data.answer);
                await peerConnection.setRemoteDescription(remoteDesc);
            }
            if (message.data.offer && waitCall) {
                peerConnection.setRemoteDescription(new RTCSessionDescription(message.data.offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                sendWSMsg({'answer': answer, userId: userId.current})
            }
            if (message.data.iceCandidate) {
                try {
                    await peerConnection.addIceCandidate(message.data.iceCandidate);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }
        };
        return () => {
            wsClient.close();
        };
    }, []);

    const sendWSMsg = (data) => {
        ws.current.send(JSON.stringify({channelName: '1', userId: userId.current, ...data}));
    };

    const [waitCall, setWaitCall] = useState(false);

    let localStream;
    let peerConnection;
    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}

    async function makeCall() {
        peerConnection = new RTCPeerConnection(configuration);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        sendWSMsg({type: 'send_offer', offer: offer});
        waitICE();
    }

    const setupDevice = () => {
        navigator.getUserMedia({ audio: true, video: true }, (stream) => {
            const localPlayer = document.getElementById('localPlayer') as HTMLVideoElement;
            localPlayer.srcObject = stream;
            localStream = stream;
        }, (error) => {
            console.error('getUserMedia error:', error);
        });
    };

    const waitForCall = () => {
        peerConnection = new RTCPeerConnection(configuration);
        setWaitCall(true);
        waitICE();
    }

    const waitICE = () => {
        peerConnection.addEventListener('icecandidate', event => {
            if (event.candidate) {
                sendWSMsg({'new-ice-candidate': event.candidate, userId: userId.current});
            }
        });
    }

    const joinRoom = () => {
        sendWSMsg({type: 'join'});
    }

    return (<>
        {/*<input placeholder="User ID" onchange={(e) => setUserId(e.target.value)} />*/}
        <Button onClick={setupDevice}>Start stream</Button>
        <Button onClick={makeCall}>Make Call</Button>
        <Button onClick={waitForCall}></Button>
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
        </div>
    </>)
}