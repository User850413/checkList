import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/app/lib/db/models/users';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
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
        { status: 401 }
      );

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({
        error: ERROR_MESSAGES.INVALID_REFRESH_TOKEN.ko,
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        iss: 'checkList-app',
      },
      REFRESH_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ accessToken });
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message }, { status: 500 });

    return NextResponse.json(
      { error: ERROR_MESSAGES.REFRESH_SECRET_ERROR.ko },
      { status: 500 }
    );
  }
}
