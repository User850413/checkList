'use client';

import { useState } from 'react';
import InputBox from './inputBox';
import StyledButton from '../common/styledButton';
import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { emailCheck } from '@/app/utils/emailCheck';

interface SignupFormState {
  username: string;
  email: string;
  password: string;
}

export default function SignupForm() {
  const [inputValue, setInputValue] = useState<SignupFormState>({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState({
    email: false,
    password: false,
    username: false,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const setKeyValue = <K extends keyof SignupFormState>(
    key: K,
    newValue: SignupFormState[K]
  ) => {
    setInputValue((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleSubmit = () => {
    if (!inputValue.email) {
      setError({ email: true, password: false, username: false });
      setErrorMessage(ERROR_MESSAGES.EMPTY_EMAIL.ko);
      return;
    }

    if (!emailCheck(inputValue.email)) {
      setError({ email: true, password: false, username: false });
      setErrorMessage(ERROR_MESSAGES.INVALID_EMAIL.ko);
      return;
    }

    if (!inputValue.password) {
      setError({ email: false, password: true, username: false });
      setErrorMessage(ERROR_MESSAGES.EMPTY_PWD.ko);
      return;
    }

    if (inputValue.password.length < 8) {
      setError({ email: false, password: true, username: false });
      setErrorMessage(ERROR_MESSAGES.SHORT_PWD.ko);
      return;
    }

    if (!inputValue.username) {
      setError({ email: false, password: false, username: true });
      setErrorMessage(ERROR_MESSAGES.EMPTY_USERNAME.ko);
      return;
    }
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
          fieldType="username"
          setKeyValue={(username) => setKeyValue('username', username)}
          required
          maxLength={10}
          inputValue={inputValue.username}
        />
        <StyledButton className="w-full" type="submit">
          회원가입
        </StyledButton>
      </form>
    </>
  );
}
