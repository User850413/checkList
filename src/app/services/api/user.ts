import { UserInput } from '@/types/user';
import axios from 'axios';

export async function userLogin({ email, password }: Partial<UserInput>) {
  if (!email?.trim()) throw new Error('이메일을 입력해 주세요');
  if (!password?.trim()) throw new Error('비밀번호를 입력해 주세요');

  try {
    const res = await axios.post('/api/login', { email, password });
    return res.data;
  } catch (error) {
    console.error(`로그인 중 오류 발생 : ${error}`);
    throw error;
  }
}
