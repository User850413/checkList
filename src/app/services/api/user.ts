import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { emailCheck } from '@/app/utils/emailCheck';
import { UserInput } from '@/types/user';
import axios from 'axios';

export async function userRegister({
  email,
  password,
  username,
}: Partial<UserInput>) {
  const trimmedEmail = email?.trim();
  const trimmedPassword = password?.trim();
  const trimmedUsername = username?.trim();

  if (!trimmedEmail) throw new Error(ERROR_MESSAGES.EMPTY_EMAIL.ko);
  if (!trimmedPassword) throw new Error(ERROR_MESSAGES.EMPTY_PWD.ko);
  if (!trimmedUsername) throw new Error(ERROR_MESSAGES.EMPTY_USERNAME.ko);
  if (!emailCheck(trimmedEmail))
    throw new Error(ERROR_MESSAGES.INVALID_EMAIL.ko);
  if (trimmedPassword.length < 8) throw new Error(ERROR_MESSAGES.SHORT_PWD.ko);

  try {
    const res = await axios.post(
      '/api/register',
      {
        email: trimmedEmail,
        password: trimmedPassword,
        username: trimmedUsername,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch {
    throw new Error('회원가입 중 오류가 발생했습니다');
  }
}

export async function userLogin({ email, password }: Partial<UserInput>) {
  const trimmedEmail = email?.trim();
  const trimmedPassword = password?.trim();
  if (!trimmedEmail) throw new Error(ERROR_MESSAGES.EMPTY_EMAIL.ko);
  if (!trimmedPassword) throw new Error(ERROR_MESSAGES.EMPTY_PWD.ko);
  if (!emailCheck(trimmedEmail))
    throw new Error(ERROR_MESSAGES.INVALID_EMAIL.ko);
  if (trimmedPassword.length < 8) throw new Error(ERROR_MESSAGES.SHORT_PWD.ko);

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
