"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
var ws_1 = require("ws");
var uuid_1 = require("uuid");
var rooms = [];
var wss = new ws_1.WebSocketServer({ port: 3001 });
console.log('started listening');
wss.on('connection', function (socket) {
    console.log('A client has connected!');
    socket['__uuid'] = (0, uuid_1.v4)();
    socket.on('error', console.error);
    socket.on('message', function (message) { return onMessage(wss, socket, message); });
    socket.on('close', function (message) { return onClose(wss, socket, message); });
});
var send = function (wsClient, type, body) {
    console.log('socket message send [type]', type, '[body]', body);
    wsClient.send(JSON.stringify(__assign({ type: type }, body)));
};
var onMessage = function (wss, socket, message) {
    console.log("onMessage ".concat(message));
    var body = JSON.parse(message);
    var type = body.type;
    var roomId = body.roomId;
    var userId = body.userId;
    var foundRoom = rooms.find(function (room) { return room.id === roomId; });
    switch (type) {
        case 'join': {
            if (foundRoom) {
                var foundUser = foundRoom.users.find(function (user) { return user.id === userId.id; });
                if (foundUser) {
                    foundUser.socket = socket;
                }
                else {
                    foundRoom.users.push({
                        id: userId,
                        socket: socket
                    });
                }
                //.filter(user => user.id !== userId)
                foundRoom.users.forEach(function (user) {
                    send(user.socket, 'joined', { userId: userId, users: foundRoom.users.map(function (u) { return u.id; }) });
                });
            }
            else {
                var newRoom = new Room(roomId, [{
                        id: userId,
                        socket: socket
                    }]);
                rooms.push(newRoom);
                send(socket, 'joined', { userId: userId, users: [userId] });
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
            var sdp = body.sdp;
            var offerToUserId_1 = body.offerToUserId;
            var otherUser = foundRoom.users.find(function (user) { return user.id === offerToUserId_1; });
            send(otherUser.socket, 'offer_sdp_received', { sdp: sdp, userId: userId });
            break;
        }
        case 'send_answer': {
            if (!foundRoom)
                return;
            // exchange sdp to peer
            var sdp = body.sdp;
            var answerToUserId_1 = body.answerToUserId;
            var otherUser = foundRoom.users.find(function (user) { return user.id === answerToUserId_1; });
            send(otherUser.socket, 'answer_sdp', { sdp: sdp, userId: userId });
            break;
        }
        case 'send_ice_candidate': {
            if (!foundRoom)
                return;
            var candidate_1 = body.candidate;
            var otherUsers = foundRoom.users.filter(function (user) { return user.id !== userId; });
            otherUsers.forEach(function (user) {
                send(user.socket, 'ice_candidate_received', { candidate: candidate_1, userId: userId });
            });
        }
        default:
            break;
    }
};
function onClose(wss, socket, message) {
    console.log('onClose', message);
    for (var _i = 0, rooms_1 = rooms; _i < rooms_1.length; _i++) {
        var room = rooms_1[_i];
        var index = room.users.findIndex(function (user) { return user.socket['__uuid'] === socket['__uuid']; });
        if (index != null) {
            console.log('removed user', room.users[index].id);
            quit(room, room.users[index].id);
            //room.users.splice(index, 1);
            break;
        }
    }
}
var Room = /** @class */ (function () {
    function Room(id, users) {
        if (users === void 0) { users = []; }
        this.id = id;
        this.users = users;
    }
    return Room;
}());
exports.Room = Room;
var quit = function (room, userId) {
    room.users = room.users.filter(function (user) { return user.id !== userId; });
    //possibility to delete room if no users are there;
    if (!room.users.length)
        rooms.splice(rooms.findIndex(function (room) { return room.id === room.id; }), 1);
    else {
        room.users.forEach(function (user) {
            send(user.socket, 'left', { userId: userId });
        });
    }
};
