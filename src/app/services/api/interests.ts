import { NextResponse } from 'next/server';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { interest } from '@/types/interest';

import apiClient from '../token/apiClient';

export async function getAllInterest() {
  try {
    const res = await apiClient.get('/interests');

    return res.data;
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message }, { status: 500 });

    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 },
    );
  }
}

export async function getMyInterest() {
  try {
    const res = await apiClient.get('/interests/mine');

    return res.data;
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message }, { status: 500 });

    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 },
    );
  }
}

export async function getWordInterest({ word }: { word: string }) {
  try {
    const trimmedWord = word.trim();
    if (!trimmedWord) return;
    const res = await apiClient.get(`/interests?word=${trimmedWord}`);

    return res.data;
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message }, { status: 500 });

    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 },
    );
  }
}

export async function postInterest({ name }: Pick<interest, 'name'>) {
  try {
    const trimmedName = name.trim();

    if (!trimmedName) throw new Error(ERROR_MESSAGES.EMPTY_INTEREST_NAME.ko);
    if (trimmedName.length > 15)
      throw new Error('관심사 명 최대길이는 15자 입니다');

    const res = await apiClient.post('/interests', { name: trimmedName });
    return res.data;
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json({ error: err.message }, { status: 500 });

    return NextResponse.json(
      { error: ERROR_MESSAGES.SERVER_ERROR.ko },
      { status: 500 },
    );
  }
}
