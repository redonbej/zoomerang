import {NextRequest} from "next/server";
import prisma from "@/lib/prisma";

const rooms = {} as any;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    console.log('params are', params.id)
    console.log('params id', params.id)
    const room = await prisma.room.findFirst({where: {id: params.id}});
    return Response.json(room, {status : room ? 200 : 404});
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json() as RoomRequest;

    switch (body.type) {
        case 'join': {
            if (rooms[params.id]) {

            }
            break;
        }
        default: {
            break;
        }
    }

}

export interface RoomRequest {
    userId: string;
    type: 'join' | 'leave' | 'send-offer' | 'send-answer' | 'send-ice';
}