import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];


  if (!token) {
    return NextResponse.json({ valid: false, message: 'Token is missing' }, { status: 400 });
  }

  try {
    const decoded: any = jwt.decode(token);


    if (!decoded || decoded.exp * 1000 < Date.now()) {
      return NextResponse.json({ valid: false, message: 'Token expired or invalid' }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {

    console.error('Error decoding token:', error);
    return NextResponse.json({ valid: false, message: 'Token decoding failed' }, { status: 401 });
  }
}
