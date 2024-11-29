import dbConnect from '@/app/lib/db/dbConnect';
import { NextResponse } from 'next/server';
import User from '@/app/lib/db/models/users';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: 'username은 필수 입력사항입니다' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: '유효한 email 형식을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'password는 최소 8자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const session = await mongoose.startSession();

    try {
      const result = await session.withTransaction(async () => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('이미 사용중인 email입니다');
        }

        const newUser = new User({ username, email, password });
        await newUser.save({ session });

        return { username, email, id: newUser._id };
      });

      return NextResponse.json(result, { status: 201 });
    } catch (transactionError) {
      const errorMessage =
        transactionError instanceof Error
          ? transactionError.message
          : '트랜잭션 중 알 수 없는 오류 발생';

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
