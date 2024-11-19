import dbConnect from '@/app/lib/db/dbConnect';
import Check from '@/app/lib/db/models/checks';
import { NextResponse } from 'next/server';

export async function GET({ params }: { params: { id: string } }) {
  await dbConnect();
  // NOTE: 파라미터 가져오기
  const { id } = params;

  const check = await Check.findById(id);

  return new Response(check, { status: 200 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;
  const body = await req.json();

  const updatedCheck = await Check.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updatedCheck);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;

  await Check.findByIdAndDelete(id);

  return new Response('삭제되었습니다,', { status: 204 });
}
