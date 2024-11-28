import Tag from '@/app/lib/db/models/tags';
import mongoose from 'mongoose';

export const updateTagAndChecks = async (tagId: string, newTagName: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 태그 이름 변경
    const updatedTag = await Tag.findByIdAndUpdate(
      tagId,
      { name: newTagName },
      { session, new: true }
    );

    if (!updatedTag) {
      throw new Error('Tag not found');
    }

    await session.commitTransaction();
    session.endSession();

    return updatedTag;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
