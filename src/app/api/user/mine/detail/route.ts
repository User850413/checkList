import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import Interest from '@/app/lib/db/models/interests';
import UserDetail from '@/app/lib/db/models/userDetails';
import { getUserId } from '@/app/services/token/getUserId';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    const userDetail = await UserDetail.findById(userId).select('bio interest');
    if (!userDetail)
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND_USER.ko },
        { status: 404 }
      );

    return NextResponse.json({ userDetail }, { status: 200 });
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

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    if (body.interest) {
      const interests = body.interest;

      for (const interest of interests) {
        const isExistedInterest = await Interest.findOne({ name: interest });
        if (!isExistedInterest) {
          return NextResponse.json(
            { error: ERROR_MESSAGES.NOT_FOUND_INTEREST.ko },
            { status: 400 }
          );
        }
      }
    }

    const { bio, interest } = body;
    const updateData = {
      ...(bio !== undefined && { bio }),
      ...(interest !== undefined && { interest }),
    };

    const updatedUserDetail = await UserDetail.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    if (!updatedUserDetail) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND_USER.ko },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUserDetail, { status: 200 });
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