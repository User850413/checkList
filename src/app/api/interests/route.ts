import { NextRequest, NextResponse } from 'next/server';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import Interest from '@/app/lib/db/models/interests';
import { getUserId } from '@/app/services/token/getUserId';

export async function GET(req: NextRequest) {
  try {
    const rawPage = parseInt(req.nextUrl?.searchParams.get('page') ?? '1', 10);
    const rawLimit = parseInt(
      req.nextUrl?.searchParams.get('limit') ?? '10',
      10,
    );
    const word = decodeURIComponent(
      req.nextUrl.searchParams.get('word') || '',
    ).toString();

    if (word) {
      const interestList = await Interest.find({
        name: { $regex: new RegExp(word, 'i') },
      }).select('name');
      return NextResponse.json({ data: interestList });
    }

    if (Number.isNaN(rawPage) || Number.isNaN(rawLimit)) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_PAGINATION.ko },
        { status: 400 },
      );
    }

    const page = !rawPage || rawPage < 1 ? 1 : rawPage;
    const limit = !rawLimit || rawLimit < 1 || rawLimit > 100 ? 10 : rawLimit;
    const skip = (page - 1) * limit;

    const interestList = await Interest.find()
      .select('name')
      .skip(skip)
      .limit(limit);
    const total = await Interest.countDocuments();

    return NextResponse.json(
      { total, page, limit, data: interestList },
      { status: 200 },
    );
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

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { error } = getUserId(req);
    if (error) return NextResponse.json({ error }, { status: 403 });

    const data = await req.json();
    if (!data.name) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.EMPTY_INTEREST_NAME.ko,
        },
        { status: 400 },
      );
    }

    const name = data.name.trim();
    const existedInterest = await Interest.findOne({ name });
    if (existedInterest)
      return NextResponse.json(
        { error: ERROR_MESSAGES.EXISTED_INTEREST_NAME.ko },
        { status: 400 },
      );

    const newInterest = await Interest.create({ name });
    return NextResponse.json(newInterest);
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
