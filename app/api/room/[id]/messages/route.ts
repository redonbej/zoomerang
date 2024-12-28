import {NextRequest} from "next/server";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import {RoomMessage} from "@/lib/interfaces";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    const room = await prisma.room.findFirst({where: {id: id}});
    if (!room) {
        return Response.json({message: 'notFound'}, {status: 404});
    }
    let messages = await redis.lRange( `room:${id}`, 0, -1 );
    messages = messages.map(message => JSON.parse(message));
    return Response.json({messages: messages});
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    const roomMsg = await req.json() as RoomMessage;
    const room = await prisma.room.findFirst({where: {id: id}});
    if (!room) {
        return Response.json({message: 'notFound'}, {status: 404});
    }
    const message = await redis.rPush( `room:${id}`, JSON.stringify(roomMsg));
    return Response.json({message: message});
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    const room = await prisma.room.findFirst({where: {id: id}});
    if (!room) {
        return Response.json({message: 'notFound'}, {status: 404});
    }
    const message = await redis.del( `room:${id}`);
    return Response.json({message: message});
}