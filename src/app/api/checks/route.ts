import dbConnect from '@/app/lib/db/dbConnect';
import Check from '@/app/lib/db/models/checks';
import { NextResponse } from 'next/server';

export async function GET() {
  // NOTE: 쿼리값 가져오기
  //   const searchParams = req.nextUrl.searchParams
  //   const query = searchParams.get('test')  -> query는 test(key)의 value값 string

  await dbConnect();
  await Check.updateMany(
    { isCompleted: { $exists: false } },
    { $set: { isCompleted: false } }
  );
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
    const newCheck = await Check.create(data);
    return NextResponse.json(newCheck);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
}
