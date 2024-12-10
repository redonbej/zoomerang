// app/api/auth/getDetails/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Token is missing' }, { status: 400 });
  }

  try {
    const decoded: any = jwt.decode(token);
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      return NextResponse.json({ message: 'Token expired' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Token is valid' });
  } catch (error) {
    return NextResponse.json({ message: 'Token is invalid' }, { status: 401 });
  }
}
