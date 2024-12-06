// import { WebSocketServer } from "ws";
//
// export default async function handler(req, res) {
//     console.log(req.url)
//     console.log('got request')
//     const wss = new WebSocketServer({ noServer: true });
//     wss.on('connection', function connection(ws) {
//         ws.on('message', function incoming(message) {
//             console.log('received: %s', message);
//             ws.send(message);
//         });
//     });
// // Upgrade HTTP request to WebSocket connection
//     if (!res.writableEnded) {
//         res.writeHead(101, {
//             'Content-Type': 'text/plain',
//             'Connection': 'Upgrade',
//             'Upgrade': 'websocket'
//         });
//         res.end();
//     }
//     wss.handleUpgrade(req, req.socket, Buffer.alloc(0), function done(ws) {
//         wss.emit('connection', ws, req);
//     });
// }