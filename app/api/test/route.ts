import {NextRequest} from "next/server";
import redis from "@/lib/redis";

export async function GET(req: NextRequest) {
    await redis.set('key', 'value');
    const value = await redis.get('key');
    return Response.json({value });
}