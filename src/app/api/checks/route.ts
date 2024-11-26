import dbConnect from '@/app/lib/db/dbConnect';
import Check from '@/app/lib/db/models/checks';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // NOTE: 쿼리값 가져오기
  const searchParams = req.nextUrl.searchParams;
  const tag = searchParams.get('tag');

  await dbConnect();

  if (!!tag) {
    const check = await Check.find({ tag }).lean();
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
    } else if (data.tag === '') {
      return NextResponse.json(
        { error: '태그명은 필수입니다' },
        { status: 400 }
      );
    }
    const newCheck = await Check.create(data);
    return NextResponse.json(newCheck);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
}
