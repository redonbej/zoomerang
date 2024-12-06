"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var rooms = {};
var wss = new ws_1.WebSocketServer({ port: 3001 });
console.log('started listening');
wss.on('connection', function (socket) {
    console.log('A client has connected!');
    socket.on('error', console.error);
    socket.on('message', function (message) { return onMessage(wss, socket, message); });
    socket.on('close', function (message) { return onClose(wss, socket, message); });
});
var send = function (wsClient, type, body) {
    console.log('ws send', body);
    wsClient.send(JSON.stringify({
        type: type,
        body: body,
    }));
};
var clearClient = function (wss, socket) {
    Object.keys(rooms).forEach(function (cname) {
        Object.keys(rooms[cname]).forEach(function (uid) {
            if (rooms[cname][uid] === socket) {
                delete rooms[cname][uid];
            }
        });
    });
};
var onMessage = function (wss, socket, message) {
    console.log("onMessage ".concat(message));
    var body = JSON.parse(message);
    var type = body.type;
    var channelName = body.channelName;
    var userId = body.userId;
    switch (type) {
        case 'join': {
            // join channel
            if (rooms[channelName]) {
                rooms[channelName][userId] = socket;
            }
            else {
                rooms[channelName] = {};
                rooms[channelName][userId] = socket;
            }
            var userIds = Object.keys(rooms[channelName]);
            send(socket, 'joined', userIds);
            break;
        }
        case 'quit': {
            // quit channel
            if (rooms[channelName]) {
                rooms[channelName][userId] = null;
                var userIds = Object.keys(rooms[channelName]);
                if (userIds.length === 0) {
                    delete rooms[channelName];
                }
            }
            break;
        }
        case 'send_offer': {
            // exchange sdp to peer
            var sdp_1 = body.sdp;
            var userIds = Object.keys(rooms[channelName]);
            userIds.forEach(function (id) {
                if (userId.toString() !== id.toString()) {
                    var wsClient = rooms[channelName][id];
                    send(wsClient, 'offer_sdp_received', sdp_1);
                }
            });
            break;
        }
        case 'send_answer': {
            // exchange sdp to peer
            var sdp_2 = body.sdp;
            var userIds = Object.keys(rooms[channelName]);
            userIds.forEach(function (id) {
                if (userId.toString() !== id.toString()) {
                    var wsClient = rooms[channelName][id];
                    send(wsClient, 'answer_sdp_received', sdp_2);
                }
            });
            break;
        }
        case 'send_ice_candidate': {
            var candidate_1 = body.candidate;
            var userIds = Object.keys(rooms[channelName]);
            userIds.forEach(function (id) {
                if (userId.toString() !== id.toString()) {
                    var wsClient = rooms[channelName][id];
                    send(wsClient, 'ice_candidate_received', candidate_1);
                }
            });
        }
        default:
            break;
    }
};
function onClose(wss, socket, message) {
    console.log('onClose', message);
    clearClient(wss, socket);
}
