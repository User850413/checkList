import { NextRequest, NextResponse } from 'next/server';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import Tag from '@/app/lib/db/models/tags';
import { getUserId } from '@/app/services/token/getUserId';
import { Tag as TagType } from '@/types/tag';
import Interest from '@/app/lib/db/models/interests';
import { interest } from '@/types/interest';
import { calculateCompletedRate } from '@/app/services/database/completedRate';
import UserTag from '@/app/lib/db/models/userTags';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    const rawPage = parseInt(req.nextUrl?.searchParams.get('page') ?? '1', 10);
    const rawLimit = parseInt(
      req.nextUrl?.searchParams.get('limit') ?? '10',
      10,
    );

    if (Number.isNaN(rawPage) || Number.isNaN(rawLimit)) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_PAGINATION.ko },
        { status: 400 },
      );
    }

    const page = !rawPage || rawPage < 1 ? 1 : rawPage;
    const limit = !rawLimit || rawLimit < 1 || rawLimit > 100 ? 10 : rawLimit;
    const skip = (page - 1) * limit;

    let myTags = [];
    let total = 0;

    // NOTE : 1. UserTags에서 userId로 필터링
    myTags = await UserTag.find({ userId }).lean();
    myTags = myTags.flatMap((tag) => tag.tags);

    // NOTE : 2. isCompleted 필터링
    const isCompleted = req.nextUrl.searchParams.get('isCompleted');
    if (isCompleted) {
      if (isCompleted !== 'true' && isCompleted !== 'false')
        return NextResponse.json(
          { error: ERROR_MESSAGES.TYPE_BOOLEAN_ERROR.ko },
          { status: 400 },
        );

      myTags = myTags.filter(
        (item: { tagId: string; isCompleted: boolean }) =>
          item.isCompleted === true,
      );
    }

    // console.log(myTags);

    return NextResponse.json({});

    // const filter: Record<string, any> = {};

    // const interest = req.nextUrl.searchParams.get('interest');

    // if (isCompleted) {
    //   if (isCompleted !== 'true' && isCompleted !== 'false')
    //     return NextResponse.json(
    //       { error: ERROR_MESSAGES.TYPE_BOOLEAN_ERROR.ko },
    //       { status: 400 },
    //     );
    //   filter.isCompleted = isCompleted === 'true';
    // }
    // if (interest) {
    //   const conversedInterest = await Interest.findOne({ name: interest });
    //   if (!conversedInterest)
    //     return NextResponse.json(
    //       { error: ERROR_MESSAGES.NOT_FOUND_INTEREST.ko },
    //       { status: 400 },
    //     );

    //   filter.interest = conversedInterest._id;
    // }

    // myTags = await Tag.find({ userId, ...filter })
    //   .skip(skip)
    //   .limit(limit)
    //   .lean<TagType[]>();
    // total = await Tag.find({ userId, ...filter }).countDocuments();

    // NOTE : tag response에 completedRate 추가
    // const tagsWithRates = await Promise.all(
    //   myTags.map(async (tag) => {
    //     const completedRate = await calculateCompletedRate(tag._id);
    //     return { ...tag, completedRate };
    //   }),
    // );

    // NOTE : interest 모델로부터 objectId를 통해 name 추출
    // let mappedTags: TagType[] = [];
    // for (const tagItem of tagsWithRates) {
    //   if (tagItem.interest !== null) {
    //     const interestId = tagItem.interest.toString();
    //     const foundedId: interest | null = await Interest.findById(interestId);
    //     if (foundedId) {
    //       mappedTags.push({ ...tagItem, interest: foundedId.name });
    //     } else {
    //       mappedTags = myTags;
    //     }
    //   } else {
    //     mappedTags = myTags;
    //   }
    // }

    // return NextResponse.json({ total, page, limit, data: mappedTags });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.TOKEN_ERROR.ko },
      { status: 500 },
    );
  }
}
