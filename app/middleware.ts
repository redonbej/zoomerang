import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';


export function middleware(request: NextRequest) {
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
      return NextResponse.next();
    } catch (error) {
      console.error('Error decoding token:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }