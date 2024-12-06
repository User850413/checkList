'use client';

import StyledButton from '@/components/common/styledButton';
import Header from '@/components/layout/header';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const route = useRouter();

  const onClickLogout = () => {
    sessionStorage.removeItem('token');
    route.push('/login?loggedOut=true');
  };

  return (
    <>
      <Header />
      <div className="bg-red-100">내 페이지</div>
      <StyledButton color="dark" onClick={onClickLogout}>
        로그아웃
      </StyledButton>
    </>
  );
}
