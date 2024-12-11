import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/app/lib/db/models/users';

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('Cookie');

    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader
          .split('; ')
          .map((cookie) => cookie.split('=').map(decodeURIComponent))
      );

      const refreshToken = cookies['refreshToken'];

      if (!refreshToken) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.EXPIRED_REFRESH_TOKEN.ko },
          { status: 401 }
        );
      }

      await dbConnect();

      const REFRESH_SECRET = process.env.REFRESH_SECRET;
      if (!REFRESH_SECRET)
        return NextResponse.json(
          { error: ERROR_MESSAGES.REFRESH_SECRET_ERROR.ko },
          { status: 500 }
        );
      // return NextResponse.json({ message: refreshToken });
      // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTJjZWFmOTllOTE1ZTZkZmVkOTY0MSIsImVtYWlsIjoic2FtcGxlQHNhbXBsZS5jb20iLCJpYXQiOjE3MzM5MTQxMjUsImlzcyI6ImNoZWNrTGlzdC1hcHAiLCJleHAiOjE3MzQwMDA1MjV9.Ea6QWCgfP-kBPa2KbueKpGUeUTEDaroH9ZImw9MrJfw

      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
        id: string;
      };
      const user = await User.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        return NextResponse.json({
          error: ERROR_MESSAGES.INVALID_REFRESH_TOKEN.ko,
        });
      }

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET)
        return NextResponse.json(
          { error: ERROR_MESSAGES.JWT_SECRET_ERROR.ko },
          { status: 500 }
        );

      const accessToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          iat: Math.floor(Date.now() / 1000),
          iss: 'checkList-app',
        },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      const response = NextResponse.json(
        { message: '새 토큰이 발행되었습니다' },
        { status: 200 }
      );

      response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        // secure: true,
        // sameSite: 'strict',
        path: '/',
        maxAge: 15 * 60,
      });

      return response;
    } else {
      return NextResponse.json(
        { error: ERROR_MESSAGES.EXPIRED_REFRESH_TOKEN.ko },
        { status: 500 }
      );
    }
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message }, { status: 500 });

    return NextResponse.json(
      { error: ERROR_MESSAGES.REFRESH_SECRET_ERROR.ko },
      { status: 500 }
    );
  }
}
