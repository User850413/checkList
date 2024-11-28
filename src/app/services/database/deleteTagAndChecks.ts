import Check from '@/app/lib/db/models/checks';
import Tag from '@/app/lib/db/models/tags';
import mongoose from 'mongoose';

export const deleteTagAndChecks = async (tagId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingTag = await Tag.findById(tagId);
    if (!existingTag) {
      throw new Error('존재하지 않는 태그입니다');
    }

    // 관련 Checks 삭제
    await Check.deleteMany({ tagId }, { session });

    // 태그 삭제
    await Tag.findByIdAndDelete(tagId, { session });

    session.endSession();
  } catch (error) {
    session.endSession();
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error('유효하지 않은 태그 ID입니다.');
    } else if (error instanceof mongoose.Error.CastError) {
      throw new Error('잘못된 형식의 태그 ID입니다.');
    } else {
      throw new Error('태그 삭제 중 오류가 발생했습니다.');
    }
  } finally {
    await session.abortTransaction();
  }
};
