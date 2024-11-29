'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import InputBox from '../common/inputBox';
import StyledButton from '../common/styledButton';
import { emailCheck } from '@/app/utils/emailCheck';

export default function AuthForm() {
  const [email, setEmail] = useState<string | undefined>('');
  const [pwd, setPwd] = useState<string | undefined>('');

  const emailRef = useRef<null | HTMLInputElement>(null);
  const pwdRef = useRef<null | HTMLInputElement>(null);

  // 리렌더 방지 목적으로 참조할 value값
  const emailValue = useRef(email);
  const pwdValue = useRef(pwd);

  useEffect(() => {
    emailValue.current = email;
    pwdValue.current = pwd;
  }, [email, pwd]);

  const onChangeEmailInput = useCallback(() => {
    setEmail(emailRef.current?.value);
  }, []);
  const onChangePwdInput = useCallback(() => {
    setPwd(pwdRef.current?.value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!emailValue.current || !emailCheck(emailValue.current)) {
      emailRef.current?.focus();
      return;
    } else if (!pwdValue.current) {
      pwdRef.current?.focus();
      return;
    }
  }, [emailValue, pwdValue]);

  const handleEnterDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <div className="w-[480px] mx-auto bg-white shadow-card rounded-xl p-10 flex flex-col items-center gap-5">
      <InputBox
        label="Email"
        type="email"
        value={email}
        onChange={onChangeEmailInput}
        ref={emailRef}
        required
        autoFocus
        onKeyDown={handleEnterDown}
      />
      <InputBox
        label="비밀번호"
        type="password"
        value={pwd}
        required
        onChange={onChangePwdInput}
        ref={pwdRef}
        autoFocus
        onKeyDown={handleEnterDown}
      />
      <StyledButton className="w-full" onClick={handleSubmit}>
        로그인
      </StyledButton>
    </div>
  );
}
