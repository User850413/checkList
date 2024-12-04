import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { NextResponse } from 'next/server';
import Tag from '@/app/lib/db/models/tags';
import dbConnect from '@/app/lib/db/dbConnect';
import { getUserId } from '@/app/services/token/getUserId';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 401 });
    const loggedInUserId = userId;
    const requestedUserId = params.id;

    if (loggedInUserId === requestedUserId) {
      const myTags = await Tag.find({ userId: loggedInUserId });
      return NextResponse.json(myTags);
    } else {
      const otherUserTags = await Tag.find({ userId: requestedUserId });
      return NextResponse.json(otherUserTags);
    }
  } catch {
    return NextResponse.json(
      { error: ERROR_MESSAGES.TOKEN_ERROR.ko },
      { status: 500 }
    );
  }
}
