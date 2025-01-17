import {NextApiRequest, NextApiResponse} from "next";
import { WebSocketServer } from "ws";
import {NextResponse} from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {

    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            ws.send(message);
        });
    });


    NextResponse.json({}, {status: 101, headers: {
        'Content-Type': 'text/plain',
        'Connection': 'Upgrade',
        'Upgrade': 'websocket'
    }});

    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
        wss.emit('connection', ws, req);
    });
}