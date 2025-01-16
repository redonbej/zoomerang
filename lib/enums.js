"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebRTCMessageType = void 0;
var WebRTCMessageType;
(function (WebRTCMessageType) {
    WebRTCMessageType["Join"] = "join";
    WebRTCMessageType["Quit"] = "quit";
    WebRTCMessageType["SendOffer"] = "send_offer";
    WebRTCMessageType["SendAnswer"] = "send_answer";
    WebRTCMessageType["SendIceCandidate"] = "send_ice_candidate";
    WebRTCMessageType["MessageSend"] = "message_send";
    WebRTCMessageType["Joined"] = "joined";
    WebRTCMessageType["OfferSdpReceived"] = "offer_sdp_received";
    WebRTCMessageType["AnswerSdp"] = "answer_sdp";
    WebRTCMessageType["IceCandidateReceived"] = "ice_candidate_received";
    WebRTCMessageType["MessageReceived"] = "message_received";
    WebRTCMessageType["Left"] = "left";
    WebRTCMessageType["PING"] = "ping";
})(WebRTCMessageType || (exports.WebRTCMessageType = WebRTCMessageType = {}));
