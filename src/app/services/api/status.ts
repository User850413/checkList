import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import apiClient from '../token/apiClient';

export async function checkToken() {
  try {
    const res = await apiClient.get('/status');

    return res.data;
  } catch {
    console.error(ERROR_MESSAGES.TOKEN_ERROR.ko);
    return null;
  }
}
