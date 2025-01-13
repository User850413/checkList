import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import User from '@/app/lib/db/models/users';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error(ERROR_MESSAGES.JWT_SECRET_ERROR.ko);

const REFRESH_SECRET = process.env.REFRESH_SECRET as string;
if (!REFRESH_SECRET) throw new Error(ERROR_MESSAGES.REFRESH_SECRET_ERROR.ko);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.EMPTY_EMAIL.ko },
        { status: 400 },
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.EMPTY_PWD.ko },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND_USER.ko },
        { status: 404 },
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.INVALID_USER.ko,
        },
        { status: 403 },
      );
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        iss: 'checkList-app',
      },
      JWT_SECRET,
      { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        iss: 'checkList-app',
      },
      REFRESH_SECRET,
      { expiresIn: '7d' },
    );

    const updateResult = await User.findByIdAndUpdate(user._id, {
      refreshToken,
    });
    if (!updateResult) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UPDATE_FAILED.ko },
        { status: 500 },
      );
    }

    const response = NextResponse.json(
      { message: '로그인되었습니다', userId: user._id },
      { status: 200 },
    );

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      // secure: true,
      // sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60,
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true,
      // sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
