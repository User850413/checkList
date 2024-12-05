import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import User from '@/app/lib/db/models/users';
import type { User as UserType } from '@/types/user';
import { NextRequest, NextResponse } from 'next/server';

// NOTE: 전체 유저 불러오는 엔드포인트
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const rawPage = Number(req.nextUrl?.searchParams.get('page'));
    const rawLimit = Number(req.nextUrl?.searchParams.get('limit'));

    const page = !rawPage || rawPage < 1 ? 1 : rawPage;
    const limit = !rawLimit || rawLimit < 1 || rawLimit > 100 ? 10 : rawLimit;
    const skip = (page - 1) * limit;

    const userList: UserType[] = await User.find()
      .select('username createdAt updatedAt profileUrl')
      .skip(skip)
      .limit(limit);
    const total = await User.countDocuments();

    return NextResponse.json(
      { total, page, limit, data: userList },
      { status: 200 }
    );
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
