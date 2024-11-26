import dbConnect from '@/app/lib/db/dbConnect';
import { NextResponse } from 'next/server';
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
