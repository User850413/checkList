import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  return NextResponse.json({ hello: 'hello' });
}

export const config = {
  matcher: ['/api/:path*'],
};
