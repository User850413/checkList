import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { NextRequest, NextResponse } from 'next/server';
import Tag from '@/app/lib/db/models/tags';
import dbConnect from '@/app/lib/db/dbConnect';
import { getUserId } from '@/app/services/token/getUserId';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 401 });

    const rawPage = Number(req.nextUrl?.searchParams.get('page'));
    const rawLimit = Number(req.nextUrl?.searchParams.get('limit'));

    const page = !rawPage || rawPage < 1 ? 1 : rawPage;
    const limit = !rawLimit || rawLimit < 1 || rawLimit > 100 ? 10 : rawLimit;
    const skip = (page - 1) * limit;

    const myTags = await Tag.find({ userId }).skip(skip).limit(limit);
    return NextResponse.json(myTags);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.TOKEN_ERROR.ko },
      { status: 500 }
    );
  }
}
