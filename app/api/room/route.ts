import {NextRequest} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');
    const rooms = await prisma.room.findMany({where: code ? {code: code}: undefined});
    return Response.json({ test: 'test', params: req.nextUrl.searchParams.toString(), rooms: rooms });
}

export async function POST(req: NextRequest) {
    const room = await prisma.room.create({
        data: {
            code: randomStr(10),
            creator: req.nextUrl.searchParams.get('creator') || 'No Name provided'
        }
    });

    return Response.json({...room}, {status: 201});
}

function randomStr(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}