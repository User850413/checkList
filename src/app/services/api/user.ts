import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { emailCheck } from '@/app/utils/emailCheck';
import { UserInput } from '@/types/user';
import axios from 'axios';

const validateUserInput = ({ email, password }: Partial<UserInput>) => {
  const trimmedEmail = email?.trim();
  const trimmedPassword = password?.trim();

  if (!trimmedEmail) throw new Error(ERROR_MESSAGES.EMPTY_EMAIL.ko);
  if (!trimmedPassword) throw new Error(ERROR_MESSAGES.EMPTY_PWD.ko);

  if (!emailCheck(trimmedEmail))
    throw new Error(ERROR_MESSAGES.INVALID_EMAIL.ko);
  if (trimmedPassword.length < 8) throw new Error(ERROR_MESSAGES.SHORT_PWD.ko);

  return { trimmedEmail, trimmedPassword };
};

export async function userRegister({
  email,
  password,
  username,
}: Partial<UserInput>) {
  const { trimmedEmail, trimmedPassword } = validateUserInput({
    email,
    password,
  });

  const trimmedUsername = username?.trim();
  if (!trimmedUsername) throw new Error(ERROR_MESSAGES.EMPTY_USERNAME.ko);

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
    throw new Error(ERROR_MESSAGES.REGISTER_ERROR.ko);
  }
}

export async function userLogin({ email, password }: Partial<UserInput>) {
  const { trimmedEmail, trimmedPassword } = validateUserInput({
    email,
    password,
  });

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

    if (res.status === 200) {
      const { token, expiresIn } = res.data;
      const tokenData = {
        value: token,
        expires: Date.now() + expiresIn * 1000,
      };

      sessionStorage.setItem('token', tokenData.value);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error(ERROR_MESSAGES.INVALID_USER.ko);
      }
      if (error.response?.status === 429) {
        throw new Error(ERROR_MESSAGES.TOO_MANY_TRIES.ko);
      }
      throw new Error(ERROR_MESSAGES.LOGIN_ERROR.ko);
    }
    throw error;
  }
}
