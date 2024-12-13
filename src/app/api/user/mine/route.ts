import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import User from '@/app/lib/db/models/users';
import { getUserId } from '@/app/services/token/getUserId';
import { NextRequest, NextResponse } from 'next/server';

// NOTE : request의 accessToken으로 내 정보 불러오기
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // NOTE : 토큰 검증 및 userId 추출
    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    const user = await User.findOne({ userId }).select(
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
      { error: ERROR_MESSAGES.TOKEN_ERROR.ko },
      { status: 500 }
    );
  }
}
