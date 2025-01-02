import { NextRequest, NextResponse } from 'next/server';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import User from '@/app/lib/db/models/users';
import { getUserId } from '@/app/services/token/getUserId';

// NOTE : request의 accessToken으로 내 정보 불러오기
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // NOTE : 토큰 검증 및 userId 추출
    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    const user = await User.findById(userId).select(
      'username createdAt updatedAt profileUrl'
    );
    if (!user)
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND_USER.ko },
        { status: 404 }
      );

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 }
    );
  }
}

// NOTE : 내 데이터 업데이트(username)
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    const data = await req.json();

    if (data.username === '') {
      return NextResponse.json(
        { error: ERROR_MESSAGES.EMPTY_USERNAME.ko },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: data.username,
      },
      { new: true }
    );

    if (!updatedUser)
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND_USER.ko },
        { status: 404 }
      );

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 }
    );
  }
}
