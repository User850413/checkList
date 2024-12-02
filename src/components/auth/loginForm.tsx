'use client';
import { useState } from 'react';
import InputBox from '../common/inputBox';
import StyledButton from '../common/styledButton';

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

  const setKeyValue = <K extends keyof LoginFormState>(
    key: K,
    newValue: LoginFormState[K]
  ) => {
    setInputValue((prev) => ({ ...prev, [key]: newValue }));
  };

  // const { mutate } = useMutation({
  //   mutationFn: ({ email, password }: Partial<UserInput>) =>
  //     userLogin({ email, password }),
  //   onError: (err) => {
  //     console.error(`로그인 실패 : ${err}`);
  //   },
  // });

  // useEffect(() => {
  //   emailValue.current = email;
  //   pwdValue.current = pwd;
  // }, [email, pwd]);

  // // 제출 로직
  const handleSubmit = () => {
    if (!inputValue.email) {
      setError((prev) => ({ ...prev, email: true }));
    } else if (!inputValue.password) {
      setError({ email: false, password: true });
    } else {
      setError({ email: false, password: false });
    }
  };
  //   mutate({ email: emailValue.current, password: pwdValue.current });
  // }, [mutate, emailValue, pwdValue]);

  const handleEnterDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <>
      <div className="w-[480px] mx-auto bg-white shadow-card rounded-xl p-10 flex flex-col items-center gap-5">
        <InputBox
          fieldType="email"
          setKeyValue={(email) => setKeyValue('email', email)}
          required
          onKeyDown={handleEnterDown}
          isError={error.email}
        />
        <InputBox
          fieldType="password"
          setKeyValue={(password) => setKeyValue('password', password)}
          required
          onKeyDown={handleEnterDown}
          isError={error.password}
        />
        <StyledButton className="w-full" onClick={handleSubmit}>
          로그인
        </StyledButton>
      </div>
    </>
  );
}

// 해야하는거
// 토큰 저장
// 로그인폼으로 이름바꾸거나 확장성 추가하거나 해야함
