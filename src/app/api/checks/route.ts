import dbConnect from '@/app/lib/db/dbConnect';
import Check from '@/app/lib/db/models/checks';
import { createCheck } from '@/app/services/database/createCheck';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // NOTE: 쿼리값 가져오기
  const searchParams = req.nextUrl.searchParams;
  const tagId = searchParams.get('tagId');

  await dbConnect();

  if (tagId) {
    const check = await Check.find({ tagId }).lean();
    return new Response(JSON.stringify(check), { status: 200 });
  }

  const checks = await Check.find();
  return NextResponse.json(checks);
}

export async function POST(req: Request) {
  await dbConnect();

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

  if (!id) {
    return NextResponse.json({ error: 'id는 필수 값입니다' }, { status: 400 });
  }

  const updatedCheck = await Check.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updatedCheck);
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');

  await dbConnect();

  if (!id) {
    return NextResponse.json({ error: 'id는 필수 값입니다' }, { status: 400 });
  }
  await Check.findByIdAndDelete(id);

  return new Response('삭제되었습니다.', { status: 200 });
}
