'use client';
import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import LoginForm from '@/components/auth/loginForm';
import { toaster } from '@/components/ui/toaster';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  const searchParams = useSearchParams();

  //NOTE: 세션 만료로 리다이렉션 시 받아오는 파라미터값
  const sessionExpired = searchParams.get('sessionExpired');

  useEffect(() => {
    if (sessionExpired) {
      toaster.create({
        title: `${ERROR_MESSAGES.EXPIRED_SESSION.ko}. ${ERROR_MESSAGES.LOGIN_AGAIN.ko}`,
        type: 'error',
      });
    }
  }, [sessionExpired]);

  return (
    <>
      <div className="h-screen flex items-center">
        <LoginForm />
      </div>
    </>
  );
}
