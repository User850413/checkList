import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import Check from '@/app/lib/db/models/checks';
import { Check as CheckType } from '@/types/check';
import { NextResponse } from 'next/server';

export const calculateCompletedRate = async (tagId: string) => {
  try {
    const checks: CheckType[] = await Check.find({ tagId });

    const total = checks.length;
    const completed = checks.filter((check) => check.isCompleted).length;

    const completedRate = total > 0 ? Math.floor((completed / total) * 100) : 0;

    return completedRate;
  } catch (err) {
    if (err instanceof Error) {
      console.log({ error: err.message });
    } else {
      console.log(ERROR_MESSAGES.SERVER_ERROR.ko);
    }
    return 0;
  }
};
