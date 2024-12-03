import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { verifyAuthToken } from '@/app/services/token/verifyToken';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Tag from '@/app/lib/db/models/tags';
import dbConnect from '@/app/lib/db/dbConnect';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { error, token } = verifyAuthToken(req);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET)
      return NextResponse.json(
        { error: ERROR_MESSAGES.JWT_SECRET_ERROR.ko },
        { status: 500 }
      );

    const decoded = jwt.verify(token!, JWT_SECRET) as { userId: string };
    const loggedInUserId = decoded.userId;
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
