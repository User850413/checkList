import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import User from '@/app/lib/db/models/users';
import { NextResponse } from 'next/server';

// NOTE: 전체 유저 불러오는 엔드포인트
export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return NextResponse.json(users);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return new Response(
      JSON.stringify({ error: ERROR_MESSAGES.SERVER_ERROR.ko }),
      { status: 500 }
    );
  }
}
