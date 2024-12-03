'use client';

import { useState } from 'react';
import InputBox from './inputBox';
import StyledButton from '../common/styledButton';
import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { emailCheck } from '@/app/utils/emailCheck';
import { useMutation } from '@tanstack/react-query';
import { userRegister } from '@/app/services/api/user';
import { UserInput } from '@/types/user';

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
    newValue: SignupFormState[K]
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
    console.log(errorMessage);

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
        className="w-[480px] mx-auto bg-white shadow-card rounded-xl p-10 flex flex-col items-center gap-5"
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          handleSubmit();
        }}
        noValidate
      >
        <InputBox
          fieldType="email"
          setKeyValue={(email) => setKeyValue('email', email)}
          required
          isError={error.email}
          errorText={errorMessage}
          inputValue={inputValue.email}
        />
        <InputBox
          fieldType="password"
          setKeyValue={(password) => setKeyValue('password', password)}
          required
          isError={error.password}
          errorText={errorMessage}
          inputValue={inputValue.password}
        />
        <InputBox
          fieldType="passwordCheck"
          setKeyValue={(passwordCheck) =>
            setKeyValue('passwordCheck', passwordCheck)
          }
          required
          isError={error.passwordCheck}
          errorText={errorMessage}
          inputValue={inputValue.passwordCheck}
        />
        <InputBox
          fieldType="username"
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
