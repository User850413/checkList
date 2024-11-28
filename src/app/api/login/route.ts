import dbConnect from '@/app/lib/db/dbConnect';
import User from '@/app/lib/db/models/users';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error('JWT 환경 변수가 설정되지 않았습니다');

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: '이메일 및 비밀번호는 필수 입력사항입니다',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: '존재하지 않는 email입니다' },
        { status: 404 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        {
          error: '아이디 혹은 비밀번호가 일치하지 않습니다',
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        iat: Math.floor(Date.now()),
        iss: 'checkList-app',
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json(
      { message: '로그인되었습니다', token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
