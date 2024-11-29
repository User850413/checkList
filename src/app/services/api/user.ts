import { emailCheck } from '@/app/utils/emailCheck';
import { UserInput } from '@/types/user';
import axios from 'axios';

export async function userLogin({ email, password }: Partial<UserInput>) {
  const trimmedEmail = email?.trim();
  const trimmedPassword = password?.trim();
  if (!trimmedEmail) throw new Error('이메일을 입력해 주세요');
  if (!trimmedPassword) throw new Error('비밀번호를 입력해 주세요');
  if (!emailCheck(trimmedEmail))
    throw new Error('올바른 email 형식을 입력해 주세요');
  if (trimmedPassword.length < 8)
    throw new Error('비밀번호는 최소 8자 이상이어야 합니다!');

  try {
    const res = await axios.post(
      '/api/login',
      {
        email: trimmedEmail,
        password: trimmedPassword,
      },
      {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
      }
      if (error.response?.status === 429) {
        throw new Error(
          '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요'
        );
      }
      throw new Error('로그인 중 오류가 발생했습니다');
    }
    throw error;
  }
}
