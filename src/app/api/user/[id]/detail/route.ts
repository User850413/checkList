import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import UserDetail from '@/app/lib/db/models/userDetails';
import { getUserId } from '@/app/services/token/getUserId';
import { NextRequest, NextResponse } from 'next/server';

// NOTE : userId로 특정 유저 userDetail 정보 불러오기
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = (await params).id;
  try {
    await dbConnect();

    // NOTE : 토큰 검증
    const { error } = getUserId(req);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const userDetail = await UserDetail.findOne({ userId }).select(
      'bio interest'
    );
    if (!userDetail)
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND_USER.ko },
        { status: 404 }
      );

    return NextResponse.json({ userDetail }, { status: 200 });
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
