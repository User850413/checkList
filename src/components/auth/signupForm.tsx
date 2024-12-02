'use client';

import { useState } from 'react';
import InputBox from './inputBox';
import StyledButton from '../common/styledButton';

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

  const setKeyValue = <K extends keyof SignupFormState>(
    key: K,
    newValue: SignupFormState[K]
  ) => {
    setInputValue((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleSubmit = () => {};

  return (
    <>
      <form
        className="w-[480px] mx-auto bg-white shadow-card rounded-xl p-10 flex flex-col items-center gap-5"
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <InputBox
          fieldType="username"
          setKeyValue={(username) => setKeyValue('username', username)}
          required
        />
        <InputBox
          fieldType="email"
          setKeyValue={(email) => setKeyValue('email', email)}
          required
          //   isError={error.email}
          //   errorText={emailMessage}
          inputValue={inputValue.email}
        />
        <InputBox
          fieldType="password"
          setKeyValue={(password) => setKeyValue('password', password)}
          required
          //   isError={error.password}
          //   errorText={pwdMessage}
          inputValue={inputValue.password}
        />
        <StyledButton className="w-full" type="submit">
          회원가입
        </StyledButton>
      </form>
    </>
  );
}
