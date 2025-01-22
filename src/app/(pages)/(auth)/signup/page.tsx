'use client';

import { checkToken } from '@/app/services/api/status';
import SignupForm from '@/components/auth/signupForm';
import { useEffect } from 'react';

export default function SignUp() {
  // NOTE : 로그인 확인
  useEffect(() => {
    checkToken().catch((error) => console.error(error));
  }, []);

  return (
    <>
      <div className="-mt-16 flex h-screen min-h-fit flex-col items-center justify-center">
        <SignupForm />
      </div>
    </>
  );
}
