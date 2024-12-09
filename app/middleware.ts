import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.headers.get('token');
  
    if (!token) {
      console.log('Token is missing');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  
    console.log('Token:', token);
    return NextResponse.next();
  }