'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { userLogin } from '@/app/services/api/register';
import { emailCheck } from '@/app/utils/emailCheck';
import { UserInput } from '@/types/user';

import InputBox from './inputBox';
import StyledButton from '../common/styledButton';
import { Toaster, toaster } from '../ui/toaster';

export const labels = {
  email: {
    type: 'email',
    en: 'email',
    ko: '이메일',
    ariaLabel: '이메일 입력',
  },
  password: {
    type: 'password',
    en: 'password',
    ko: '비밀번호',
    ariaLabel: '비밀번호 입력',
  },
} as const;

interface LoginFormState {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [inputValue, setInputValue] = useState<LoginFormState>({
    email: '',
    password: '',
  });
  const [error, setError] = useState({ email: false, password: false });
  const [emailMessage, setEmailMessage] = useState('');
  const [pwdMessage, setPwdMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const setKeyValue = <K extends keyof LoginFormState>(
    key: K,
    newValue: LoginFormState[K],
  ) => {
    setInputValue((prev) => ({ ...prev, [key]: newValue }));
  };

  const { mutate } = useMutation({
    mutationFn: ({ email, password }: Partial<UserInput>) =>
      userLogin({ email, password }),
    onError: () => {
      setIsLoading(false);
      return toaster.create({
        title: ERROR_MESSAGES.INVALID_USER.ko,
        type: 'error',
      });
    },
    onSuccess: () => {
      setIsLoading(false);
      router.push('/');
    },
  });

  // 에러 상태 처리
  const resetErrors = () => ({
    email: false,
    password: false,
    passwordCheck: false,
    username: false,
  });

  const setFieldError = (field: keyof typeof error) => {
    setError({ ...resetErrors(), [field]: true });
  };

  // 제출 로직
  const handleSubmit = () => {
    setIsLoading(true);
    if (!inputValue.email) {
      setIsLoading(false);
      setFieldError('email');
      setEmailMessage(ERROR_MESSAGES.EMPTY_EMAIL.ko);
      return;
    }

    if (!emailCheck(inputValue.email)) {
      setIsLoading(false);
      setFieldError('password');
      setEmailMessage(ERROR_MESSAGES.INVALID_EMAIL.ko);
      return;
    }

    if (!inputValue.password) {
      setIsLoading(false);
      setFieldError('password');
      setPwdMessage(ERROR_MESSAGES.EMPTY_PWD.ko);
      return;
    }

    if (inputValue.password.length < 8) {
      setIsLoading(false);
      setFieldError('password');
      setPwdMessage(ERROR_MESSAGES.SHORT_PWD.ko);
      return;
    }

    setError({ email: false, password: false });
    mutate(inputValue);
  };

  return (
    <>
      <Toaster />
      <form
        className="mx-auto flex w-[480px] flex-col items-center gap-5 rounded-xl bg-white p-10 shadow-card"
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          handleSubmit();
        }}
        noValidate
      >
        <InputBox
          label={labels.email}
          setKeyValue={(email) => setKeyValue('email', email)}
          required
          isError={error.email}
          errorText={emailMessage}
          inputValue={inputValue.email}
        />
        <InputBox
          label={labels.password}
          setKeyValue={(password) => setKeyValue('password', password)}
          required
          isError={error.password}
          errorText={pwdMessage}
          inputValue={inputValue.password}
        />
        <StyledButton className="w-full" type="submit" disabled={isLoading}>
          로그인
        </StyledButton>
      </form>
    </>
  );
}
