import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { NextRequest, NextResponse } from 'next/server';
import Interest from '@/app/lib/db/models/interests';

export async function GET(req: NextRequest) {
  try {
    const rawPage = parseInt(req.nextUrl?.searchParams.get('page') ?? '1', 10);
    const rawLimit = parseInt(
      req.nextUrl?.searchParams.get('limit') ?? '10',
      10
    );

    if (Number.isNaN(rawPage) || Number.isNaN(rawLimit)) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_PAGINATION.ko },
        { status: 400 }
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

    return NextResponse.json({ total, page, limit, data: interestList });
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
