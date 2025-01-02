'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getMyData } from '@/app/services/api/user';
import { User } from '@/types/user';

import Profile from './profile';

export default function Header() {
  const [myData, setMyData] = useState<User | undefined>();

  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMyData(),
    retry: false,
  });

  const router = useRouter();

  //NOTE: 세션 만료 시 리다이렉션
  useEffect(() => {
    if (error) {
      console.error(error.message);
      router.push('/login?sessionExpired=true');
    }
  }, [error, router]);

  useEffect(() => {
    if (isSuccess) setMyData(data.user);
  }, [isSuccess, data]);

  if (isLoading) return <div> loading... </div>;

  return (
    <div className="fixed left-0 right-0 top-0 bg-white shadow-card flex items-center justify-between py-3 px-6 z-10 min-w-[480px]">
      <ul className="flex items-center gap-4 text-sm text-slate-500">
        <li>
          <button onClick={() => router.push('/')}>메인화면</button>
        </li>
        <li>
          <button onClick={() => router.push('/my-list')}>내 리스트</button>
        </li>
      </ul>
      {myData && (
        <ul className="flex items-center gap-4 cursor-default text-sm text-slate-500">
          <li>{myData.username}</li>
          <li>
            <Profile
              profileUrl={myData.profileUrl}
              username={myData.username}
              clickable
              clickFn={() => {
                router.push('/user-page');
              }}
            />
          </li>
        </ul>
      )}
    </div>
  );
}
