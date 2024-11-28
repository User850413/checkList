import Tag from '@/app/lib/db/models/tags';
import mongoose from 'mongoose';

export const updateTagAndChecks = async (tagId: string, newTagName: string) => {
  if (!tagId || typeof tagId !== 'string') {
    throw new Error('유효하지 않은 tagId입니다');
  }
  if (
    !newTagName ||
    typeof newTagName !== 'string' ||
    newTagName.trim() === ''
  ) {
    throw new Error('유혀하지 않은 태그 이름입니다.');
  }

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

    return updatedTag;
  } catch (error: unknown) {
    await session.abortTransaction();
    if (error instanceof Error) {
      throw new Error(`태그 업데이트 실패: ${error.message}`);
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  } finally {
    session.endSession();
  }
};
