import mongoose from 'mongoose';

import { USER_DEFAULT } from '@/app/lib/constants/userDefault';
import UserDetail from '@/app/lib/db/models/userDetails';
import UserTag from '@/app/lib/db/models/userTags';

export async function createNewUser(
  userId: string,
  session: mongoose.mongo.ClientSession,
) {
  try {
    const userDetail = new UserDetail({
      userId,
      bio: USER_DEFAULT.BIO,
      interest: USER_DEFAULT.INTERESTS,
    });

    await userDetail.save({ session });
    const defaultTags = USER_DEFAULT.TAGS || [];

    const userTag = new UserTag({ userId, tagId: defaultTags });
    await userTag.save({ session });

    console.log('사용자 디테일 및 기본 태그 리스트 생성 성공');
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
    throw new Error('사용자 상세 정보 생성 실패');
  }
}
