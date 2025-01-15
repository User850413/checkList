import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import Interest from '@/app/lib/db/models/interests';
import Tag from '@/app/lib/db/models/tags';
import UserTag from '@/app/lib/db/models/userTags';
import { getUserId } from '@/app/services/token/getUserId';
import {
  Tag as TagType,
  UserTagDetail,
  UserTag as UserTagType,
} from '@/types/tag';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// NOTE : 내가 설정한 관심사(userDetail)가 아니라 내가 생성한 리스트의 모든 관심사 불러오기
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    let myTagData: UserTagType | null;

    // NOTE : UserTag 모델에서 userId 일치하는 데이터 가져오기
    myTagData = await UserTag.findOne({ userId });
    if (!myTagData)
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_USER.ko },
        { status: 403 },
      );

    // NOTE : isCompleted 필터
    const isCompleted = req.nextUrl.searchParams.get('isCompleted');

    let myTagDataList: UserTagDetail[] = myTagData.tags;
    if (isCompleted) {
      myTagDataList = myTagData.tags.filter(
        (tag) => tag.isCompleted === JSON.parse(isCompleted),
      );
    }

    // userTag 데이터로 Tag에서 데이터 찾기
    const myTagList: TagType[] = await Promise.all(
      myTagDataList.map((tag) => Tag.findOne({ _id: tag.tagId })),
    );

    // NOTE : 찾은 interest 리스트 중복 제거
    const uniqueInterests = new Set(
      myTagList.map((tag) => tag.interest.toString()),
    );
    const myInterestIdList = Array.from(uniqueInterests).map((id) => ({ id }));

    // NOTE : id값 추출 후 objectId로 변환
    const objectIds = myInterestIdList.map(
      (interest) => new mongoose.Types.ObjectId(interest.id),
    );

    // 변환한 id값들로 Interest 스키마에서 가져오기
    const myInterestList = await Interest.find({
      _id: { $in: objectIds },
    }).select('name');

    return NextResponse.json({ data: myInterestList }, { status: 200 });
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message }, { status: 500 });
    return NextResponse.json(
      { err: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 },
    );
  }
}
