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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
var ws_1 = require("ws");
var uuid_1 = require("uuid");
var rooms = [];
var wss = new ws_1.WebSocketServer({ port: 3001 });
var url = "http://localhost:3000/api/room/[:id]/messages";
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
var onMessage = function (wss, socket, message) { return __awaiter(void 0, void 0, void 0, function () {
    var body, type, roomId, userId, foundRoom, _a, foundUser, newRoom, sdp, offerToUserId_1, otherUser, sdp, answerToUserId_1, otherUser, candidate_1, otherUsers, message_1, response, body_1, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("onMessage ".concat(message));
                body = JSON.parse(message);
                type = body.type;
                roomId = body.roomId;
                userId = body.userId;
                foundRoom = rooms.find(function (room) { return room.id === roomId; });
                _a = type;
                switch (_a) {
                    case 'join': return [3 /*break*/, 1];
                    case 'quit': return [3 /*break*/, 2];
                    case 'send_offer': return [3 /*break*/, 3];
                    case 'send_answer': return [3 /*break*/, 4];
                    case 'send_ice_candidate': return [3 /*break*/, 5];
                    case 'message_send': return [3 /*break*/, 6];
                }
                return [3 /*break*/, 12];
            case 1:
                {
                    if (foundRoom) {
                        foundUser = foundRoom.users.find(function (user) { return user.id === userId.id; });
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
                        newRoom = new Room(roomId, [{
                                id: userId,
                                socket: socket
                            }]);
                        rooms.push(newRoom);
                        send(socket, 'joined', { userId: userId, users: [userId] });
                    }
                    return [3 /*break*/, 13];
                }
                _b.label = 2;
            case 2:
                {
                    if (!foundRoom)
                        return [2 /*return*/];
                    quit(foundRoom, userId);
                    return [3 /*break*/, 13];
                }
                _b.label = 3;
            case 3:
                {
                    if (!foundRoom)
                        return [2 /*return*/];
                    sdp = body.sdp;
                    offerToUserId_1 = body.offerToUserId;
                    otherUser = foundRoom.users.find(function (user) { return user.id === offerToUserId_1; });
                    send(otherUser.socket, 'offer_sdp_received', { sdp: sdp, userId: userId });
                    return [3 /*break*/, 13];
                }
                _b.label = 4;
            case 4:
                {
                    if (!foundRoom)
                        return [2 /*return*/];
                    sdp = body.sdp;
                    answerToUserId_1 = body.answerToUserId;
                    otherUser = foundRoom.users.find(function (user) { return user.id === answerToUserId_1; });
                    send(otherUser.socket, 'answer_sdp', { sdp: sdp, userId: userId });
                    return [3 /*break*/, 13];
                }
                _b.label = 5;
            case 5:
                {
                    if (!foundRoom)
                        return [2 /*return*/];
                    candidate_1 = body.candidate;
                    otherUsers = foundRoom.users.filter(function (user) { return user.id !== userId; });
                    otherUsers.forEach(function (user) {
                        send(user.socket, 'ice_candidate_received', { candidate: candidate_1, userId: userId });
                    });
                    return [3 /*break*/, 13];
                }
                _b.label = 6;
            case 6:
                if (!foundRoom)
                    return [2 /*return*/];
                message_1 = body.message;
                foundRoom.users.filter(function (user) { return user.id !== userId.id; }).forEach(function (user) {
                    send(user.socket, 'message_received', { senderId: userId, message: message_1 }); //send to clients
                });
                _b.label = 7;
            case 7:
                _b.trys.push([7, 10, , 11]);
                return [4 /*yield*/, fetch(url.replace('[:id]', foundRoom.id), {
                        method: 'POST',
                        body: JSON.stringify({ message: message_1, date: new Date(), user: { id: userId } })
                    })];
            case 8:
                response = _b.sent();
                console.log('response status', response.status);
                return [4 /*yield*/, response.json()];
            case 9:
                body_1 = _b.sent();
                console.log('response body', body_1);
                return [3 /*break*/, 11];
            case 10:
                e_1 = _b.sent();
                console.error(e_1);
                return [3 /*break*/, 11];
            case 11: return [3 /*break*/, 13];
            case 12: return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
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
var quit = function (room, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                room.users = room.users.filter(function (user) { return user.id !== userId; });
                if (!!room.users.length) return [3 /*break*/, 5];
                rooms.splice(rooms.findIndex(function (room) { return room.id === room.id; }), 1);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetch(url.replace('[:id]', room.id), {
                        method: 'DELETE',
                    })];
            case 2:
                response = _a.sent();
                console.log('response status DELETE', response.status);
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                console.error(e_2);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                room.users.forEach(function (user) {
                    send(user.socket, 'left', { userId: userId });
                });
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
