import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { NextResponse } from 'next/server';
import apiClient from '../token/apiClient';
import { interest } from '@/types/interest';

export async function getAllInterest() {
  try {
    const res = await apiClient.get('/interests');

    return res.data as interest[];
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message }, { status: 500 });

    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 }
    );
  }
}

export async function postInterest({ name }: interest) {
  try {
    const trimmedName = name.trim();

    if (!trimmedName) throw new Error(ERROR_MESSAGES.EMPTY_INTEREST_NAME.ko);
    if (trimmedName.length > 10)
      throw new Error('관심사 명 최대길이는 15자 입니다');

    const res = await apiClient.post('/interest', { name: trimmedName });
    return res.data;
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message }, { status: 500 });

    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 }
    );
  }
}
