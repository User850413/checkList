import mongoose from 'mongoose';

import Check from '@/app/lib/db/models/checks';
import Tag from '@/app/lib/db/models/tags';
import UserTag from '@/app/lib/db/models/userTags';

export const deleteTagAndChecks = async (userId: string, tagId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 태그 존재 여부 확인
    const existingTag = await Tag.findById(tagId);
    if (!existingTag) {
      throw new Error('존재하지 않는 태그입니다.');
    }

    // 관련 Checks 삭제
    await Check.deleteMany({ tagId }, { session });

    // 내 태그 리스트에서 삭제
    await UserTag.updateOne({ userId }, { $pull: { tags: { tagId } } });

    // 태그 삭제
    await Tag.findByIdAndDelete(tagId, { session });

    // 트랜잭션 커밋
    await session.commitTransaction();
  } catch (error) {
    // 에러 핸들링 및 트랜잭션 중단
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    // 오류 메시지 출력 또는 로깅
    console.error('태그 삭제 중 오류 발생:', error);
    throw new Error(
      error instanceof mongoose.Error.ValidationError
        ? '유효하지 않은 태그 ID입니다.'
        : error instanceof mongoose.Error.CastError
          ? '잘못된 형식의 태그 ID입니다.'
          : '태그 삭제 중 문제가 발생했습니다.',
    );
  } finally {
    // 세션 종료
    session.endSession();
  }
};
