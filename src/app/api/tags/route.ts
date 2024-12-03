import dbConnect from '@/app/lib/db/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import Tag from '@/app/lib/db/models/tags';
import { updateTagAndChecks } from '@/app/services/database/updateTagAndChecks';
import { deleteTagAndChecks } from '@/app/services/database/deleteTagAndChecks';
import { verifyAuthToken } from '@/app/services/token/verifyToken';
import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import jwt from 'jsonwebtoken';

const getUserId = (req: Request): { userId: string; error?: string } => {
  let userId = '';

  const { error, token } = verifyAuthToken(req);
  if (error) {
    return { userId, error };
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) return { userId, error: ERROR_MESSAGES.JWT_SECRET_ERROR.ko };
  const decoded = jwt.verify(token!, JWT_SECRET) as { userId: string };

  userId = decoded.userId;

  return { userId };
};

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

  const { userId, error } = getUserId(req);
  if (!userId) return NextResponse.json({ error }, { status: 401 });

  try {
    const data = await req.json();

    if (data.name === '') {
      return NextResponse.json(
        { error: ERROR_MESSAGES.EMPTY_TAGNAME.ko },
        { status: 400 }
      );
    }

    const newTag = await Tag.create([{ name: data.name, userId }]);
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

  const { userId, error } = getUserId(req);
  if (!userId) return NextResponse.json({ error }, { status: 401 });

  await dbConnect();

  if (!tagId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.EMPTY_ID.ko },
      { status: 400 }
    );
  }

  const tag = await Tag.findById(tagId);
  if (!tag) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.NOT_FOUND_TAG.ko },
      { status: 404 }
    );
  }

  if (String(tag.userId) !== userId)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  if (!body.name) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.EMPTY_TAGNAME.ko },
      { status: 400 }
    );
  }

  try {
    const updatedTag = await updateTagAndChecks(tagId, body.name.trim());
    return NextResponse.json(updatedTag);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: '알 수 없는 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tagId = searchParams.get('id');

  await dbConnect();

  const { userId, error } = getUserId(req);
  if (!userId) return NextResponse.json({ error }, { status: 401 });

  if (!tagId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.EMPTY_ID.ko },
      { status: 400 }
    );
  }

  const tag = await Tag.findById(tagId);
  if (!tag) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.NOT_FOUND_TAG.ko },
      { status: 404 }
    );
  }
  if (String(tag.userId) !== userId)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const deletedTag = await deleteTagAndChecks(tagId);
    return NextResponse.json(
      {
        message: '삭제되었습니다',
        deletedTag,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: '알 수 없는 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
