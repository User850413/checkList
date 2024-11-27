import dbConnect from '@/app/lib/db/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import Tag from '@/app/lib/db/models/tags';

export async function GET() {
  try {
    await dbConnect();

    const tags = await Tag.find();

    return NextResponse.json(tags);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const data = await req.json();

    if (data.name === '') {
      return NextResponse.json(
        { error: '태그명은 필수사항입니다.' },
        { status: 400 }
      );
    }

    const newTag = await Tag.create([{ name: data.name }]);
    return NextResponse.json(newTag);
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

  const updatedCheck = await Tag.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updatedCheck);
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');

  await dbConnect();

  if (!id) {
    return NextResponse.json({ error: 'id는 필수 값입니다.' }, { status: 400 });
  }
  await Tag.findByIdAndDelete(id);
  return new Response('삭제되었습니다', { status: 200 });
}
