import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import Check from '@/app/lib/db/models/checks';
import { createCheck } from '@/app/services/database/createCheck';
import { verifyAuthToken } from '@/app/services/token/verifyToken';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // NOTE: 쿼리값 가져오기
  const searchParams = req.nextUrl.searchParams;
  const tagId = searchParams.get('tagId');

  const { error } = verifyAuthToken(req);
  if (error) {
    return NextResponse.json({ error }, { status: 403 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.TOKEN_ERROR.ko },
      { status: 403 }
    );
  }

  try {
    await dbConnect();
    const page = Number(req.nextUrl?.searchParams.get('page')) || 1;
    const limit = Number(req.nextUrl?.searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    if (tagId) {
      const checks = await Check.find({ tagId }).skip(skip).limit(limit).lean();
      const total = await Check.countDocuments({ tagId });

      return NextResponse.json(
        { total, page, limit, data: checks },
        { status: 200 }
      );
    }

    const checks = await Check.find().skip(skip).limit(limit);
    const total = await Check.countDocuments();

    return NextResponse.json({ total, page, limit, data: checks });
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

export async function POST(req: Request) {
  await dbConnect();

  const { error } = verifyAuthToken(req);
  if (error) {
    return NextResponse.json({ error }, { status: 403 });
  }

  try {
    const data = await req.json();

    if (data.task === '') {
      return NextResponse.json(
        { error: '내용 입력은 필수사항입니다' },
        { status: 400 }
      );
    }
    const newCheck = await createCheck(data);
    return NextResponse.json(newCheck);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
}

export async function PATCH(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const body = await req.json();
  const id = searchParams.get('id');

  await dbConnect();

  const { error } = verifyAuthToken(req);
  if (error) {
    return NextResponse.json({ error }, { status: 403 });
  }

  if (!id) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.EMPTY_ID.ko },
      { status: 400 }
    );
  }

  const updatedCheck = await Check.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updatedCheck);
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');

  const { error } = verifyAuthToken(req);
  if (error) {
    return NextResponse.json({ error }, { status: 403 });
  }

  await dbConnect();

  if (!id) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.EMPTY_ID.ko },
      { status: 400 }
    );
  }
  await Check.findByIdAndDelete(id);

  return NextResponse.json({ message: '삭제되었습니다' }, { status: 200 });
}
