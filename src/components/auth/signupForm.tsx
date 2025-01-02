'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { userRegister } from '@/app/services/api/register';
import { emailCheck } from '@/app/utils/emailCheck';
import { UserInput } from '@/types/user';

import InputBox from './inputBox';
import StyledButton from '../common/styledButton';

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
  passwordCheck: {
    type: 'password',
    en: 'password check',
    ko: '비밀번호 확인',
    ariaLabel: '비밀번호 확인 입력',
  },
  username: {
    type: 'text',
    en: 'username',
    ko: '닉네임',
    ariaLabel: '닉네임 입력',
  },
} as const;

interface SignupFormState {
  username: string;
  email: string;
  password: string;
  passwordCheck: string;
}

export default function SignupForm() {
  const [inputValue, setInputValue] = useState<SignupFormState>({
    username: '',
    email: '',
    password: '',
    passwordCheck: '',
  });
  const [error, setError] = useState({
    email: false,
    password: false,
    passwordCheck: false,
    username: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const setKeyValue = <K extends keyof SignupFormState>(
    key: K,
    newValue: SignupFormState[K],
  ) => {
    setInputValue((prev) => ({ ...prev, [key]: newValue }));
  };

  const { mutate } = useMutation({
    mutationFn: ({ email, password, username }: Partial<UserInput>) =>
      userRegister({ email, password, username }),
    onSuccess: () => {
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = () => {
    if (!inputValue.email) {
      setError({
        email: true,
        password: false,
        passwordCheck: false,
        username: false,
      });
      setErrorMessage(ERROR_MESSAGES.EMPTY_EMAIL.ko);
      return;
    }

    if (!emailCheck(inputValue.email)) {
      setError({
        email: true,
        password: false,
        passwordCheck: false,
        username: false,
      });
      setErrorMessage(ERROR_MESSAGES.INVALID_EMAIL.ko);
      return;
    }

    if (!inputValue.password) {
      setError({
        email: false,
        password: true,
        passwordCheck: false,
        username: false,
      });
      setErrorMessage(ERROR_MESSAGES.EMPTY_PWD.ko);
      return;
    }

    if (inputValue.password.length < 8) {
      setError({
        email: false,
        password: true,
        passwordCheck: false,
        username: false,
      });
      setErrorMessage(ERROR_MESSAGES.SHORT_PWD.ko);
      return;
    }

    if (inputValue.password !== inputValue.passwordCheck) {
      setError({
        email: false,
        password: false,
        passwordCheck: true,
        username: false,
      });
      setErrorMessage(ERROR_MESSAGES.PWD_CHECK_ERROR.ko);
      return;
    }

    if (!inputValue.username) {
      setError({
        email: false,
        password: false,
        passwordCheck: false,
        username: true,
      });
      setErrorMessage(ERROR_MESSAGES.EMPTY_USERNAME.ko);
      return;
    }

    setError({
      email: false,
      password: false,
      passwordCheck: false,
      username: false,
    });

    setIsLoading(true);
    mutate({
      email: inputValue.email,
      password: inputValue.password,
      username: inputValue.username,
    });
  };

  return (
    <>
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
          errorText={errorMessage}
          inputValue={inputValue.email}
        />
        <InputBox
          label={labels.password}
          setKeyValue={(password) => setKeyValue('password', password)}
          required
          isError={error.password}
          errorText={errorMessage}
          inputValue={inputValue.password}
        />
        <InputBox
          label={labels.passwordCheck}
          setKeyValue={(passwordCheck) =>
            setKeyValue('passwordCheck', passwordCheck)
          }
          required
          isError={error.passwordCheck}
          errorText={errorMessage}
          inputValue={inputValue.passwordCheck}
        />
        <InputBox
          label={labels.username}
          setKeyValue={(username) => setKeyValue('username', username)}
          required
          maxLength={10}
          inputValue={inputValue.username}
          errorText={errorMessage}
          isError={error.username}
        />
        <StyledButton className="w-full" type="submit" disabled={isLoading}>
          회원가입
        </StyledButton>
      </form>
    </>
  );
}
