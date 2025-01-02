import mongoose from 'mongoose';

import { USER_DEFAULT } from '@/app/lib/constants/userDefault';
import UserDetail from '@/app/lib/db/models/userDetails';

export async function createUserDetail(
  userId: string,
  session: mongoose.mongo.ClientSession
) {
  try {
    const userDetail = new UserDetail({
      userId,
      bio: USER_DEFAULT.BIO,
      interest: USER_DEFAULT.INTERESTS,
    });
    return await userDetail.save({ session });
  } catch {
    throw new Error('사용자 상세 정보 생성 실패');
  }
}
