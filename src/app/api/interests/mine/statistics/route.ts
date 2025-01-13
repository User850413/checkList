import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import dbConnect from '@/app/lib/db/dbConnect';
import Interest from '@/app/lib/db/models/interests';
import Tag from '@/app/lib/db/models/tags';
import { getUserId } from '@/app/services/token/getUserId';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { userId, error } = getUserId(req);
    if (!userId) return NextResponse.json({ error }, { status: 403 });

    // NOTE : 내 tags에서 isCompleted = true인 항목만 불러오기
    const myTags = await Tag.find({ userId, isCompleted: 'true' }).lean();

    // NOTE : isCompleted = true인 항목이 없을 때 빈 배열 return
    if (!myTags) return NextResponse.json({ data: [] }, { status: 200 });

    // NOTE : 상위 5개 항목 추출
    let statistics = [];
    const myInterestsId = myTags.map((tag) => tag.interest);
    const myInterests = await Promise.all(
      myInterestsId.map((interestId) =>
        Interest.findById(interestId).select('name'),
      ),
    );
    const interests = myInterests.map((interest) => interest.name);

    let count: { [key: string]: number } = {};
    if (interests.length > 0) {
      for (let key of interests) {
        count[key] = (count[key] || 0) + 1;
      }
    }

    let sortedValues = Object.entries(count)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => key)
      .slice(0, 5);

    let otherValues = Object.entries(count)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => key)
      .slice(6);

    let totalCount = 0;
    sortedValues.map((item) => {
      totalCount += count[item];
    });

    // NOTE : '그 외' 가 없을 시 바로 return
    if (otherValues.length == 0) {
      statistics = sortedValues.map((value) => {
        return { [value]: count[value] };
      });

      return NextResponse.json(
        { data: statistics, totalCount },
        { status: 200 },
      );
    }

    let otherCount = 0;
    otherValues.map((value) => (otherCount += count[value]));

    const valuesWithOthers = sortedValues
      .map((value) => {
        return { [value]: count[value] };
      })
      .concat({ '그 외': otherCount } as { [key: string]: number });

    statistics = [...valuesWithOthers].sort((a, b) => {
      return Object.values(b)[0] - Object.values(a)[0];
    });

    // console.log(count);
    // console.log(otherCount);
    // console.log(sortedValues);
    // console.log(otherValues);
    // console.log(totalCount);
    // console.log(valuesWithOthers);
    // console.log(statistics);

    return NextResponse.json({ data: statistics, totalCount }, { status: 200 });
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message }, { status: 500 });
    return NextResponse.json(
      { err: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 },
    );
  }
}
