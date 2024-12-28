import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function middleware(request: NextRequest) {
  console.log('middleware executing')
  const token = request.headers.get('token');

  if (!token) {
    console.log('Token is missing');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded: any = jwt.decode(token);

    if (!decoded || decoded.exp * 1000 < Date.now()) {
      console.log('Token expired');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('Token is valid');
    const user = await prisma.user.findMany();
    request.headers.set('user', JSON.stringify(user));
    return NextResponse.next();
  } catch (error) {
    console.error('Error handling token:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: '*',
};
