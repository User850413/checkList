import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import Interest from '@/app/lib/db/models/interests';
import UserDetail from '@/app/lib/db/models/userDetails';
import { getUserId } from '@/app/services/token/getUserId';
import { NextRequest, NextResponse } from 'next/server';

// NOTE : accessToken의 userId로 내 userDetail 정보 불러오기
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // NOTE : 토큰 검증 및 userId 추출
    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    const userDetail = await UserDetail.findOne({ userId }).select(
      'bio interest'
    );
    if (!userDetail)
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND_USER.ko },
        { status: 404 }
      );

    return NextResponse.json({ data: userDetail }, { status: 200 });
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

// NOTE : accessToken의 userId로 검증 후 내 userDetail 정보 수정
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    // NOTE : 토큰 검증 및 userId 추출
    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    // NOTE : 업데이트 body의 interest가 Interest 테이블에 존재하는지 검증
    if (body.interest) {
      const interests = body.interest;

      for (const interest of interests) {
        const isExistedInterest = await Interest.findOne({ name: interest });
        if (!isExistedInterest) {
          return NextResponse.json(
            { error: ERROR_MESSAGES.NOT_FOUND_INTEREST.ko },
            { status: 400 }
          );
        }
      }
    }

    const { bio, interest } = body;
    const updateData = {
      ...(bio !== undefined && { bio }),
      ...(interest !== undefined && { interest }),
    };

    const updatedUserDetail = await UserDetail.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    if (!updatedUserDetail) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND_USER.ko },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUserDetail, { status: 200 });
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
