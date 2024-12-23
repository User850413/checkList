import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import axios from 'axios';
import apiClient from '../token/apiClient';

// 전체 유저 정보 불러오기
export async function getAllUsers() {
  try {
    const res = await axios.get('/api/user');
    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error(ERROR_MESSAGES.SERVER_ERROR.ko);
  }
}

// 내 데이터 불러오기
export async function getMyData() {
  try {
    const res = await apiClient.get('/user/mine');
    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error(ERROR_MESSAGES.SERVER_ERROR.ko);
  }
}
