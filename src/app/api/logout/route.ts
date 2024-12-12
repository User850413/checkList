import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import User from '@/app/lib/db/models/users';
import { getUserId } from '@/app/services/token/getUserId';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 401 });
    await dbConnect();
    const user = await User.findByIdAndUpdate(userId, { refreshToken: '' });

    if (!user)
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND_USER.ko },
        { status: 404 }
      );

    const response = NextResponse.json(
      { message: ERROR_MESSAGES.LOGGED_OUT.ko },
      { status: 200 }
    );
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message }, { status: 500 });
    return NextResponse.json(
      { error: ERROR_MESSAGES.LOGOUT_ERROR.ko },
      { status: 500 }
    );
  }
}
