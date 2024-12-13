import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import axios from 'axios';
import { NextResponse } from 'next/server';
import apiClient from '../token/apiClient';

export async function getAllInterest() {
  try {
    const res = await axios.get('/api/interest');

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

export async function postInterest({ name }) {
  try {
    const trimmedName = name.trim();

    if (!trimmedName) throw new Error(ERROR_MESSAGES.EMPTY_INTEREST_NAME.ko);

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
