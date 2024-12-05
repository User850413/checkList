import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import User from '@/app/lib/db/models/users';
import { getUserId } from '@/app/services/token/getUserId';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 401 });

    const user = await User.findById(userId).select(
      'username createdAt updatedAt profileUrl'
    );
    if (!user)
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND_USER.ko },
        { status: 404 }
      );

    return NextResponse.json(user);
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
