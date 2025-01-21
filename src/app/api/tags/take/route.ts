import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import Check from '@/app/lib/db/models/checks';
import SharedTag from '@/app/lib/db/models/sharedTags';
import Tag from '@/app/lib/db/models/tags';
import UserTag from '@/app/lib/db/models/userTags';
import { getUserId } from '@/app/services/token/getUserId';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const tagId = searchParams.get('id');

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    // NOTE : tagId로 복사할 tagData 가져오기
    const tagData = await SharedTag.findOne({ _id: tagId });

    // NOTE : 가져온 tag Data로 새 tag POST
    const newTag = await Tag.create({
      name: tagData.name,
      interest: tagData.interest,
    });
    await Promise.all(
      tagData.list.map(
        async (data: string) =>
          await Check.create({ tagId: newTag._id, task: data }),
      ),
    );

    // NOTE : 사용자의 userTag에 newTag 추가
    const test = await UserTag.updateOne(
      { userId },
      { $push: { tags: { tagId: newTag._id, isCompleted: false } } },
    );

    return NextResponse.json({ data: newTag }, { status: 200 });
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
