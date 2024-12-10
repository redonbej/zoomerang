// app/api/auth/getDetails/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1]; // Extract token

  if (!token) {
    return NextResponse.json({ message: 'Token is missing' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Token received' });
}
