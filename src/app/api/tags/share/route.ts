import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import SharedTag from '@/app/lib/db/models/sharedTags';
import Tag from '@/app/lib/db/models/tags';
import { getUserId } from '@/app/services/token/getUserId';
import Check from '@/app/lib/db/models/checks';

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

    const tagsId = await SharedTag.find().skip(skip).limit(limit).lean();
    console.log(tagsId);

    const tags = await Tag.find({ _id: { $in: tagsId } });

    return NextResponse.json({ data: tags }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 },
    );
  }
}

// ALERT : 동일한 이름의 다른 체크와 태그 만드는 로직으로 수정해야 함
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const tagId = searchParams.get('id');

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    if (!tagId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.EMPTY_ID.ko },
        { status: 400 },
      );
    }

    const tag = await Tag.findOne({ _id: tagId });

    const checks = await Check.find({ tagId }).select('task').lean();
    const checksName = checks.map((check) => check.task);

    const newTag = await SharedTag.create({ name: tag.name, list: checksName });
    return NextResponse.json({ data: newTag }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 },
    );
  }
}
