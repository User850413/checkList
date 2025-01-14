import { NextRequest, NextResponse } from 'next/server';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import Interest from '@/app/lib/db/models/interests';
import Tag from '@/app/lib/db/models/tags';
import { deleteTagAndChecks } from '@/app/services/database/deleteTagAndChecks';
import { getUserId } from '@/app/services/token/getUserId';
import { interest } from '@/types/interest';
import { calculateCompletedRate } from '@/app/services/database/completedRate';
import { Tag as TagType } from '@/types/tag';
import UserTag from '@/app/lib/db/models/userTags';

// NOTE : 전체 tag 가져오기
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const rawPage = parseInt(req.nextUrl?.searchParams.get('page') ?? '1', 10);
    const rawLimit = parseInt(
      req.nextUrl?.searchParams.get('limit') ?? '10',
      10,
    );

    if (Number.isNaN(rawPage) || Number.isNaN(rawLimit)) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_PAGINATION.ko },
        { status: 400 },
      );
    }

    const page = !rawPage || rawPage < 1 ? 1 : rawPage;
    const limit = !rawLimit || rawLimit < 1 || rawLimit > 100 ? 10 : rawLimit;
    const skip = (page - 1) * limit;

    let tags: TagType[] = [];
    let total = null;

    const filter: Record<string, any> = {};

    const interest = req.nextUrl.searchParams.get('interest');

    if (interest) {
      const conversedInterest = await Interest.findOne({ name: interest });
      if (!conversedInterest)
        return NextResponse.json(
          { error: ERROR_MESSAGES.NOT_FOUND_INTEREST.ko },
          { status: 400 },
        );

      filter.interest = conversedInterest._id;
    }

    tags = await Tag.find(filter).skip(skip).limit(limit).lean<TagType[]>();
    total = await Tag.find(filter).countDocuments();

    return NextResponse.json({ total, page, limit, data: tags });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
}

// NOTE : tags 및 userTags에 새 tag 추가
export async function POST(req: NextRequest) {
  await dbConnect();

  const { userId, error } = getUserId(req);
  if (!userId) return NextResponse.json({ error }, { status: 403 });

  try {
    const data = await req.json();

    if (data.name === '') {
      return NextResponse.json(
        { error: ERROR_MESSAGES.EMPTY_TAGNAME.ko },
        { status: 400 },
      );
    }
    let interestId = null;

    if (data.interest) {
      let isExistedInterest: interest | null = await Interest.findOne({
        name: data.interest,
      });
      if (!isExistedInterest)
        isExistedInterest = await Interest.create({ name: data.interest });

      interestId = isExistedInterest!._id;
    }

    const newTag = await Tag.create({ name: data.name, interest: interestId });

    // NOTE : userTag 모델에 항목 추가
    await UserTag.updateOne(
      { userId },
      { $push: { tags: { tagId: newTag._id, isCompleted: false } } },
    );

    return NextResponse.json(newTag);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
}

// NOTE : tag 모델의 이름 변경
export async function PATCH(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const body = await req.json();
  const tagId = searchParams.get('id');

  const { userId, error } = getUserId(req);
  if (!userId) return NextResponse.json({ error }, { status: 403 });

  await dbConnect();

  if (!tagId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.EMPTY_ID.ko },
      { status: 400 },
    );
  }

  const tag = await Tag.findById(tagId);
  if (!tag) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.NOT_FOUND_TAG.ko },
      { status: 404 },
    );
  }

  if (String(tag.userId) !== userId)
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN_NOT_ALLOW.ko },
      { status: 403 },
    );

  if (body.name !== undefined && body.name.length == 0) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.EMPTY_TAGNAME.ko },
      { status: 400 },
    );
  }

  if (body.isCompleted !== undefined && typeof body.isCompleted !== 'boolean') {
    return NextResponse.json(
      { error: ERROR_MESSAGES.TYPE_BOOLEAN_ERROR.ko },
      { status: 400 },
    );
  }

  try {
    const updatedTag = await Tag.findByIdAndUpdate(
      tagId,
      {
        ...(body.name && { name: body.name }),
        ...(body.isCompleted !== undefined && {
          isCompleted: body.isCompleted,
        }),
      },
      { new: true },
    );
    if (!updatedTag)
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_FOUND_TAG.ko },
        { status: 404 },
      );

    return NextResponse.json(updatedTag, { status: 200 });
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

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tagId = searchParams.get('id');

  await dbConnect();

  const { userId, error } = getUserId(req);
  if (!userId) return NextResponse.json({ error }, { status: 403 });

  if (!tagId) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.EMPTY_ID.ko },
      { status: 400 },
    );
  }

  const tag = await Tag.findById(tagId);
  if (!tag) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.NOT_FOUND_TAG.ko },
      { status: 404 },
    );
  }
  if (String(tag.userId) !== userId)
    return NextResponse.json(
      { error: ERROR_MESSAGES.FORBIDDEN_NOT_ALLOW.ko },
      { status: 403 },
    );

  try {
    const deletedTag = await deleteTagAndChecks(tagId);
    return NextResponse.json(
      {
        message: '삭제되었습니다',
        deletedTag,
      },
      { status: 200 },
    );
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
