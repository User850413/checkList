'use client';

import { getMyData } from '@/app/services/api/user';
import StyledButton from '@/components/common/styledButton';
import FieldButton from '@/components/layout/fieldButton';
import Header from '@/components/layout/header';
import Profile from '@/components/layout/profile';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const route = useRouter();

  const onClickLogout = () => {
    sessionStorage.removeItem('token');
    route.push('/login?loggedOut=true');
  };

  const { data } = useQuery({ queryKey: ['user'], queryFn: () => getMyData() });

  const fieldList = [
    { fieldName: '건강', fieldIcon: '💪' },
    { fieldName: '취미', fieldIcon: '✨' },
    { fieldName: '음식', fieldIcon: '🍚' },
    { fieldName: '여가', fieldIcon: '🎉' },
  ];

  return (
    <>
      <Header />
      <main className="bg-white shadow-card rounded-lg mx-14 p-6 mt-14 flex gap-8 items-center">
        {data && (
          <>
            <Profile
              profileUrl={data.profileUrl}
              username={data.username}
              editable
              size="large"
            />
            <div className="flex flex-col items-start gap-4 w-full">
              <h1 className="font-bold text-xl">
                {data.username}님의 페이지입니다.
              </h1>
              <div className="bg-slate-100 w-full p-4 rounded-md">
                <h2 className="font-semibold text-base">한 마디 🎤</h2>
                <span className="text-sm text-pretty">
                  열심히 하겠습니다! 열심히 하겠습니다! 열심히 하겠습니다!
                  열심히 하겠습니다! 열심히 하겠습니다! 열심히 하겠습니다!
                  열심히 하겠습니다! 열심히 하겠습니다! 열심히 하겠습니다!
                  열심히 하겠습니다! 열심히 하겠습니다!
                </span>
              </div>
              <div className="flex items-end justify-between w-full">
                <div className="flex flex-col gap-2">
                  <span className="text-sm">
                    {data.username}님이 관심 있어하는 분야
                  </span>
                  <ul className="flex gap-1">
                    {fieldList.map((field, index) => (
                      <li key={index}>
                        <FieldButton
                          fieldName={field.fieldName}
                          fieldIcon={field.fieldIcon}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-2">
                  <StyledButton size={'sm'}>수정</StyledButton>
                  <StyledButton
                    color="dark"
                    size={'sm'}
                    onClick={onClickLogout}
                  >
                    로그아웃
                  </StyledButton>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
