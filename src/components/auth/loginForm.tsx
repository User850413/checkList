'use client';
import { useState } from 'react';
import InputBox from './inputBox';
import StyledButton from '../common/styledButton';
import { emailCheck } from '@/app/utils/emailCheck';
import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { useMutation } from '@tanstack/react-query';
import { UserInput } from '@/types/user';
import { useRouter } from 'next/navigation';
import { Toaster, toaster } from '../ui/toaster';
import { userLogin } from '@/app/services/api/register';

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
    newValue: LoginFormState[K]
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
          errorText={emailMessage}
          inputValue={inputValue.email}
        />
        <InputBox
          fieldType="password"
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
