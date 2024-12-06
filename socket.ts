import { WebSocketServer } from "ws";

const rooms = {} as any;
const wss = new WebSocketServer({port: 3001});

console.log('started listening')

wss.on('connection', (socket) => {
    console.log('A client has connected!');

    socket.on('error', console.error);
    socket.on('message', message => onMessage(wss, socket, message));
    socket.on('close', message => onClose(wss, socket, message));
});

const send = (wsClient, type, body) => {
    console.log('ws send', body);
    wsClient.send(JSON.stringify({
        type,
        body,
    }))
}

const clearClient = (wss, socket) => {
    Object.keys(rooms).forEach((cname) => {
        Object.keys(rooms[cname]).forEach((uid) => {
            if (rooms[cname][uid] === socket) {
                delete rooms[cname][uid]
            }
        })
    })
}

const onMessage = (wss, socket, message) => {
    console.log(`onMessage ${message}`);
    const body = JSON.parse(message)
    const type = body.type
    const channelName = body.channelName
    const userId = body.userId

    switch (type) {
        case 'join': {
            // join channel
            if (rooms[channelName]) {
                rooms[channelName][userId] = socket
            } else {
                rooms[channelName] = {}
                rooms[channelName][userId] = socket
            }
            const userIds = Object.keys(rooms[channelName])
            send(socket, 'joined', userIds)
            break;
        }
        case 'quit': {
            // quit channel
            if (rooms[channelName]) {
                rooms[channelName][userId] = null
                const userIds = Object.keys(rooms[channelName])
                if (userIds.length === 0) {
                    delete rooms[channelName]
                }
            }
            break;
        }
        case 'send_offer': {
            // exchange sdp to peer
            const sdp = body.sdp
            let userIds = Object.keys(rooms[channelName])
            userIds.forEach(id => {
                if (userId.toString() !== id.toString()) {
                    const wsClient = rooms[channelName][id]
                    send(wsClient, 'offer_sdp_received', sdp)
                }
            })
            break;
        }
        case 'send_answer': {
            // exchange sdp to peer
            const sdp = body.sdp
            let userIds = Object.keys(rooms[channelName])
            userIds.forEach(id => {
                if (userId.toString() !== id.toString()) {
                    const wsClient = rooms[channelName][id]
                    send(wsClient, 'answer_sdp_received', sdp)
                }
            })
            break;
        }
        case 'send_ice_candidate': {
            const candidate = body.candidate
            let userIds = Object.keys(rooms[channelName])
            userIds.forEach(id => {
                if (userId.toString() !== id.toString()) {
                    const wsClient = rooms[channelName][id]
                    send(wsClient, 'ice_candidate_received', candidate)
                }
            })
        }
        default:
            break;
    }
}
function onClose(wss, socket, message) {
    console.log('onClose', message);
    clearClient(wss, socket)
}