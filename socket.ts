import { WebSocketServer } from "ws";
import {v4 as uuid} from "uuid";
import {RoomMessage} from "./lib/interfaces";

const rooms: Room [] = [];
const wss = new WebSocketServer({port: 3001});
const url = `http://localhost:3000/api/room/[:id]/messages`;

console.log('started listening')

wss.on('connection', (socket) => {
    console.log('A client has connected!');

    socket['__uuid'] = uuid();
    socket.on('error', console.error);
    socket.on('message', message => onMessage(wss, socket, message));
    socket.on('close', message => onClose(wss, socket, message));
});

const send = (wsClient, type, body) => {
    console.log('socket message send [type]',type, '[body]', body);
    wsClient.send(JSON.stringify({
        type,
        ...body,
    }))
}

const onMessage = async (wss, socket, message) => {
    console.log(`onMessage ${message}`);
    const body = JSON.parse(message)
    const type = body.type
    const roomId = body.roomId
    const userId = body.userId

    const foundRoom = rooms.find(room => room.id === roomId);

    switch (type) {
        case 'join': {

            if (foundRoom) {
                const foundUser = foundRoom.users.find(user => user.id === userId.id);
                if (foundUser) {
                    foundUser.socket = socket;
                } else {
                    foundRoom.users.push({
                        id: userId,
                        socket: socket
                    });
                }
                //.filter(user => user.id !== userId)
                foundRoom.users.forEach(user => {
                    send(user.socket, 'joined', {userId, users: foundRoom.users.map(u => u.id)})
                });
            } else {
                const newRoom = new Room(roomId, [{
                    id: userId,
                    socket: socket
                }]);
                rooms.push(newRoom);
                send(socket, 'joined', {userId, users: [userId]})
            }

            break;
        }
        case 'quit': {
            if (!foundRoom)
                return;

            quit(foundRoom, userId);

            break;
        }
        case 'send_offer': {
            if (!foundRoom)
                return;

            const sdp = body.sdp;
            const offerToUserId = body.offerToUserId;
            const otherUser = foundRoom.users.find(user => user.id === offerToUserId);

            send(otherUser.socket, 'offer_sdp_received', {sdp, userId})

            break;
        }
        case 'send_answer': {
            if (!foundRoom)
                return;

            // exchange sdp to peer
            const sdp = body.sdp;
            const answerToUserId = body.answerToUserId;
            const otherUser = foundRoom.users.find(user => user.id === answerToUserId);

            send(otherUser.socket, 'answer_sdp', {sdp, userId})


            break;
        }
        case 'send_ice_candidate': {
            if (!foundRoom)
                return;

            const candidate = body.candidate
            const otherUsers = foundRoom.users.filter(user => user.id !== userId);

            otherUsers.forEach(user => {
                send(user.socket, 'ice_candidate_received', {candidate, userId})
            });

            break;
        }
        case 'message_send': {
            if (!foundRoom)
                return;

            const message = body.message;
            foundRoom.users.filter(user => user.id !== userId.id).forEach(user => {
                send(user.socket, 'message_received', {senderId: userId, message});//send to clients
            });
            try {
                const response = await fetch(url.replace('[:id]', foundRoom.id), {
                    method: 'POST',
                    body: JSON.stringify({message: message, date: new Date(), user: {id: userId}} as Partial<RoomMessage>)
                });
                console.log('response status', response.status);
                const body = await response.json();
                console.log('response body', body);
            } catch (e) {
                console.error(e);
            }

            break
        }
        default:
            break;
    }
}
function onClose(wss, socket, message) {
    console.log('onClose', message);
    for (const room of rooms) {
        const index = room.users.findIndex(user => user.socket['__uuid'] === socket['__uuid']);
        if (index != null) {
            console.log('removed user', room.users[index]?.id);
            if(room.users[index]?.id)
                quit(room, room.users[index].id);
            //room.users.splice(index, 1);
            break;
        }
    }

}

export class Room {

    constructor(
        public id: string,
        public users: RoomUser [] = []
    ) {}
}

export interface RoomUser {
    id: string;
    socket: WebSocket;
}

const quit = async (room: Room, userId: string) => {
    room.users = room.users.filter(user => user.id !== userId);

    //possibility to delete room if no users are there;
    if (!room.users.length) {
        rooms.splice(rooms.findIndex(room => room.id === room.id), 1);
        try {
            const response = await fetch(url.replace('[:id]', room.id), {
                method: 'DELETE',
            });
            console.log('response status DELETE', response.status);
        } catch (e) {
            console.error(e);
        }
    } else {
        room.users.forEach(user => {
            send(user.socket, 'left', {userId})
        })
    }
}