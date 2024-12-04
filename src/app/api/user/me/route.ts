import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import User from '@/app/lib/db/models/users';
import { getUserId } from '@/app/services/token/getUserId';
import type { User as UserType } from '@/types/user';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 401 });

    const userList: UserType[] = await User.find({ _id: userId });
    const { email, username, createdAt, updatedAt, profileUrl } = userList[0];

    return NextResponse.json({
      email,
      username,
      createdAt,
      updatedAt,
      profileUrl,
    });
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
