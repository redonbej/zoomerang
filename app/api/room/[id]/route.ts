import {NextRequest} from "next/server";
import prisma from "@/lib/prisma";
import {STATUS_CODES} from "node:http";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    console.log('params are', params.id)
    console.log('params id', params.id)
    const room = await prisma.room.findFirst({where: {id: params.id}});
    return Response.json(room, {status : room ? 200 : 404});
}