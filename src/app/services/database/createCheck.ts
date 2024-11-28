import Check from '@/app/lib/db/models/checks';
import Tag from '@/app/lib/db/models/tags';
import mongoose from 'mongoose';

export const createCheck = async (checkData: {
  task: string;
  isCompleted: boolean;
  tag: string;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 태그가 존재하지 않으면 생성
    const existingTag = await Tag.findOne({ name: checkData.tag });
    if (!existingTag) {
      await Tag.create([{ name: checkData.tag }], { session });
    }

    // Check 생성
    const newCheck = await Check.create([checkData], { session });

    await session.commitTransaction();
    session.endSession();

    return newCheck;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
