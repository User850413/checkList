'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getMyData } from '@/app/services/api/user';
import { User } from '@/types/user';

import Profile from './profile';
import { QueryKeys } from '@/app/lib/constants/queryKeys';

export default function Header() {
  const [myData, setMyData] = useState<User | undefined>();

  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: QueryKeys.USER_ME,
    queryFn: () => getMyData(),
    retry: false,
  });

  const router = useRouter();
  const pathname = usePathname();

  //NOTE: 세션 만료 시 리다이렉션
  useEffect(() => {
    if (error) {
      router.push('/');
    }
  }, [error, router]);

  useEffect(() => {
    if (isSuccess) {
      setMyData(data.user);
      if (pathname === '/') router.push('/my-list');
    }
  }, [isSuccess, data]);

  if (isLoading) return <div> loading... </div>;

  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex min-w-[480px] items-center justify-between bg-white px-6 py-3 shadow-card">
      <ul className="flex items-center gap-4 text-sm text-slate-500">
        <li>
          <button onClick={() => router.push('/all-list')}>메인화면</button>
        </li>
        <li>
          <button onClick={() => router.push('/my-list')}>내 리스트</button>
        </li>
      </ul>
      {myData && (
        <ul className="flex cursor-default items-center gap-4 text-sm text-slate-500">
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
