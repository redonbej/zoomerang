import type { NextRequest } from 'next/server'
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const users = await prisma.user.findMany();
    return Response.json({ test: 'test', params: req.nextUrl.searchParams.toString(), users: users });
}