import dbConnect from '@/app/lib/db/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import Tag from '@/app/lib/db/models/tags';
import { updateTagAndChecks } from '@/app/services/database/updateTagAndChecks';
import { deleteTagAndChecks } from '@/app/services/database/deleteTagAndChecks';

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
  const tagId = searchParams.get('id');

  await dbConnect();

  if (!tagId) {
    return NextResponse.json(
      { error: 'tag id는 필수 값입니다' },
      { status: 400 }
    );
  }

  if (!body.name) {
    return NextResponse.json(
      { error: '태그명은 1자 이상이어야 합니다' },
      { status: 400 }
    );
  }

  const updatedTag = await updateTagAndChecks(tagId, body.name.trim());

  return NextResponse.json(updatedTag);
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');

  await dbConnect();

  if (!id) {
    return NextResponse.json({ error: 'id는 필수 값입니다.' }, { status: 400 });
  }
  await deleteTagAndChecks(id);
  return new Response('삭제되었습니다', { status: 200 });
}
