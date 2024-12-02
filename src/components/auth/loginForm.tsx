'use client';
import { useState } from 'react';
import InputBox from '../common/inputBox';
import StyledButton from '../common/styledButton';
import { emailCheck } from '@/app/utils/emailCheck';
import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { useMutation } from '@tanstack/react-query';
import { userLogin } from '@/app/services/api/user';
import { UserInput } from '@/types/user';
import { useRouter } from 'next/navigation';

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

  const router = useRouter();

  const setKeyValue = <K extends keyof LoginFormState>(
    key: K,
    newValue: LoginFormState[K]
  ) => {
    setInputValue((prev) => ({ ...prev, [key]: newValue }));
  };

  const { mutate } = useMutation({
    mutationFn: ({ email, password }: Partial<UserInput>) =>
      userLogin({ email, password }),
    onError: () => {
      setInputValue({ email: '', password: '' });
    },
    onSuccess: () => {
      router.push('/');
    },
  });

  // 제출 로직
  const handleSubmit = () => {
    if (!inputValue.email) {
      setError({ email: true, password: false });
      setEmailMessage(ERROR_MESSAGES.EMPTY_EMAIL.ko);
      return;
    }

    if (!emailCheck(inputValue.email)) {
      console.log(inputValue.email);
      setError({ email: true, password: false });
      setEmailMessage(ERROR_MESSAGES.INVALID_EMAIL.ko);
      return;
    }

    if (!inputValue.password) {
      setError({ email: false, password: true });
      setPwdMessage(ERROR_MESSAGES.EMPTY_PWD.ko);
      return;
    }

    if (inputValue.password.length < 8) {
      setError({ email: false, password: true });
      setPwdMessage(ERROR_MESSAGES.SHORT_PWD.ko);
      return;
    }

    setError({ email: false, password: false });

    mutate(inputValue);
  };

  const handleEnterDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
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
          onKeyDown={handleEnterDown}
          isError={error.email}
          errorText={emailMessage}
          inputValue={inputValue.email}
        />
        <InputBox
          fieldType="password"
          setKeyValue={(password) => setKeyValue('password', password)}
          required
          onKeyDown={handleEnterDown}
          isError={error.password}
          errorText={pwdMessage}
          inputValue={inputValue.password}
        />
        <StyledButton className="w-full" type="submit">
          로그인
        </StyledButton>
      </form>
    </>
  );
}

// 해야하는거
// 토큰 저장
// 로그인폼으로 이름바꾸거나 확장성 추가하거나 해야함
