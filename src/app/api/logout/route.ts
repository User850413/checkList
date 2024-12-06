import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import User from '@/app/lib/db/models/users';
import { getUserId } from '@/app/services/token/getUserId';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.TOKEN_ERROR.ko },
        { status: 400 }
      );
    }

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 401 });

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_USER.ko },
        { status: 401 }
      );

    const response = NextResponse.json(
      { message: '로그아웃되었습니다.' },
      { status: 200 }
    );

    response.cookies.set('refreshToken', '', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(0),
    });

    await User.findByIdAndUpdate(userId, { refreshToken: '' });
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message }, { status: 500 });
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 }
    );
  }
}
