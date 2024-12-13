import dbConnect from '@/app/lib/db/dbConnect';
import { NextResponse } from 'next/server';
import User from '@/app/lib/db/models/users';
import mongoose from 'mongoose';
import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { createUserDetail } from '@/app/services/user/createUserDetail';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.EMPTY_USERNAME.ko },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_EMAIL.ko },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.SHORT_PWD.ko },
        { status: 400 }
      );
    }

    await dbConnect();

    const session = await mongoose.startSession();

    try {
      const result = await session.withTransaction(async () => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error(ERROR_MESSAGES.EXISTED_EMAIL.ko);
        }

        const newUser = new User({ username, email, password });
        await newUser.save({ session });

        await createUserDetail(newUser._id, session);

        return { username, email, id: newUser._id };
      });

      return NextResponse.json(result, { status: 201 });
    } catch (transactionError) {
      const errorMessage =
        transactionError instanceof Error
          ? transactionError.message
          : ERROR_MESSAGES.TRANSACTION_ERROR.ko;

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 }
    );
  }
}
