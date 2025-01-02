import mongoose from 'mongoose';

import Check from '@/app/lib/db/models/checks';
import Tag from '@/app/lib/db/models/tags';

export const createCheck = async (checkData: {
  task: string;
  isCompleted: boolean;
  tagId: string;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 태그가 존재하지 않으면 생성
    let tag = await Tag.findOne({ _id: checkData.tagId });
    if (!tag) {
      tag = await Tag.create([{ name: '새 태그' }], { session });
    }

    // Check 생성
    const newCheck = await Check.create(
      [
        {
          task: checkData.task,
          isCompleted: checkData.isCompleted,
          tagId: tag._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return newCheck;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
