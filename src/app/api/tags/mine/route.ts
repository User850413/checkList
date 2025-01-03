import { NextRequest, NextResponse } from 'next/server';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import Tag from '@/app/lib/db/models/tags';
import { getUserId } from '@/app/services/token/getUserId';
import { Tag as TagType } from '@/types/tag';
import Interest from '@/app/lib/db/models/interests';
import { interest } from '@/types/interest';

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

    const myTags: TagType[] = await Tag.find({ userId })
      .skip(skip)
      .limit(limit)
      .lean<TagType[]>();
    const total = await Tag.find({ userId }).countDocuments();

    // NOTE : interest 모델로부터 objectId를 통해 name 추출
    let mappedTags: TagType[] = [];
    for (const tagItem of myTags) {
      if (tagItem.interest !== null) {
        const interestId = tagItem.interest.toString();
        const foundedId: interest | null = await Interest.findById(interestId);
        if (foundedId) {
          mappedTags.push({ ...tagItem, interest: foundedId.name });
        } else {
          mappedTags = myTags;
        }
      } else {
        mappedTags = myTags;
      }
    }

    return NextResponse.json({ total, page, limit, data: mappedTags });
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
