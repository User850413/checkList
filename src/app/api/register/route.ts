import dbConnect from '@/app/lib/db/dbConnect';
import { NextResponse } from 'next/server';
import User from '@/app/lib/db/models/users';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: 'username은 필수 입력사항입니다' },
        { status: 400 }
      );
    } else if (!email) {
      return NextResponse.json(
        { error: 'email은 필수 입력사항입니다' },
        { status: 400 }
      );
    } else if (!password) {
      return NextResponse.json(
        { error: 'password는 필수 입력사항입니다' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: '이미 사용중인 email입니다' },
        { status: 400 }
      );
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
