import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { getUserId } from '@/app/services/token/getUserId';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    } else {
      return NextResponse.json({ authenticated: true }, { status: 200 });
    }
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 },
    );
  }
}
