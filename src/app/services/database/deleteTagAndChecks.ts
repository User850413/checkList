import Check from '@/app/lib/db/models/checks';
import Tag from '@/app/lib/db/models/tags';
import mongoose from 'mongoose';

export const deleteTagAndChecks = async (tagId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 관련 Checks 삭제
    await Check.deleteMany({ tag: tagId }, { session });

    // 태그 삭제
    await Tag.findByIdAndDelete(tagId, { session });

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
