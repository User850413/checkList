import Check from '@/app/lib/db/models/checks';
import Tag from '@/app/lib/db/models/tags';
import mongoose from 'mongoose';

export const updateTagAndChecks = async (tagId: string, newTagName: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 태그 이름 변경
    await Tag.findByIdAndUpdate(tagId, { name: newTagName }, { session });

    // 관련 Checks의 tag 필드 업데이트
    await Check.updateMany(
      { tag: tagId },
      { $set: { tag: newTagName } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
