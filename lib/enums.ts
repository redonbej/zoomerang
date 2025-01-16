export enum WebRTCMessageType {
    Join = 'join',
    Quit = 'quit',
    SendOffer = 'send_offer',
    SendAnswer = 'send_answer',
    SendIceCandidate = 'send_ice_candidate',
    MessageSend = 'message_send',
    Joined = 'joined',
    OfferSdpReceived = 'offer_sdp_received',
    AnswerSdp = 'answer_sdp',
    IceCandidateReceived = 'ice_candidate_received',
    MessageReceived = 'message_received',
    Left = 'left',
    PING = 'ping'
  }
  