import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import Interest from '@/app/lib/db/models/interests';
import UserDetail from '@/app/lib/db/models/userDetails';
import { getUserId } from '@/app/services/token/getUserId';
import { interest } from '@/types/interest';
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

    const namedInterest = [];

    // NOTE : interest 모델에서 id => name 변경 후 매핑
    const { interest }: { interest: interest[] } = userDetail;
    for (const item of interest) {
      const foundId: interest | null = await Interest.findOne({
        _id: item._id,
      });

      if (!foundId)
        return NextResponse.json(
          { error: ERROR_MESSAGES.NOT_FOUND_INTEREST.ko },
          { status: 404 }
        );

      namedInterest.push({ name: foundId.name, _id: foundId._id });
    }

    const namedUserDetail = { bio: userDetail.bio, interest: namedInterest };
    console.log(namedUserDetail);

    return NextResponse.json({ data: namedUserDetail }, { status: 200 });
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
    const newInterest = [];

    // NOTE : 토큰 검증 및 userId 추출
    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    // NOTE : 업데이트 body의 interest가 Interest 테이블에 존재하는지 검증
    if (body.interest) {
      const interests: interest[] = body.interest;

      for (const interest of interests) {
        let isExistedInterest: interest | null = await Interest.findOne({
          name: interest.name,
        });

        // NOTE : 없을 시 return
        if (!isExistedInterest) {
          isExistedInterest = await Interest.create({ name: interest.name });
        }

        // NOTE : 존재할 시 그 interest의 id 추출
        newInterest.push(isExistedInterest!._id);
      }
    }

    const { bio, interest } = body;
    const updateData = {
      ...(bio !== undefined && { bio }),
      ...(interest !== undefined && { interest: newInterest }),
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
