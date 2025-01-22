import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import apiClient from '../token/apiClient';

export async function checkToken() {
  try {
    const res = await apiClient.get('/status');

    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error(ERROR_MESSAGES.SERVER_ERROR.ko);
  }
}
