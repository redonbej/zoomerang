import RoomMeeting from "@/app/(main)/room/[id]/roomMeeting";
import {notFound} from "next/navigation";
import prisma from "@/lib/prisma";

async function fetchRoom(id: string) {
    return prisma.room.findUnique({where: {id: id}});
}

export default async function Room({params}: { params: Promise<any> }) {
    const roomId = (await params).id;

    // await new Promise(resolve => {
    //     setTimeout(() => {
    //         resolve(roomId);
    //     }, 100000)
    // })

    console.log('params are', roomId);
    const room = await fetchRoom(roomId);
    console.log('room is', room)

    if (!room) {
        //notFound();
    }

    return (<>
        <RoomMeeting id={roomId}></RoomMeeting>
    </>)
}