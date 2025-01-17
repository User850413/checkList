'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import LoginForm from '@/components/auth/loginForm';
import { Toaster, toaster } from '@/components/ui/toaster';

export default function Login() {
  const searchParams = useSearchParams();

  //NOTE: 세션 만료로 리다이렉션 시
  const sessionExpired = searchParams.get('sessionExpired');

  useEffect(() => {
    if (sessionExpired) {
      toaster.create({
        title: `${ERROR_MESSAGES.EXPIRED_SESSION.ko}. ${ERROR_MESSAGES.LOGIN_AGAIN.ko}`,
        type: 'error',
      });
    }
  }, [sessionExpired]);

  // NOTE: 로그아웃 후 리다이렉션 시
  const loggedOut = searchParams.get('loggedOut');

  useEffect(() => {
    if (loggedOut) {
      toaster.create({
        title: ERROR_MESSAGES.LOGGED_OUT.ko,
        type: 'success',
      });
    }
  }, [loggedOut]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Toaster />
        <div className="flex h-screen items-center">
          <LoginForm />
        </div>
      </Suspense>
    </>
  );
}
