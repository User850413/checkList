import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { NextResponse } from 'next/server';
import Tag from '@/app/lib/db/models/tags';
import dbConnect from '@/app/lib/db/dbConnect';
import { getUserId } from '@/app/services/token/getUserId';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 401 });

    const myTags = await Tag.find({ userId });
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
