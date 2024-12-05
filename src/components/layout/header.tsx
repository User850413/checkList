'use client';

import { getMyData } from '@/app/services/api/user';
import { useQuery } from '@tanstack/react-query';
import Profile from './profile';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: () => getMyData(),
  });

  const router = useRouter();

  if (error) {
    router.push('/login');
  }

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
      {data && (
        <ul className="flex items-center gap-4 cursor-default text-sm text-slate-500">
          <li>{data!.username}</li>
          <li>
            <Profile
              profileUrl={data!.profileUrl}
              username={data!.username}
              clickable
            />
          </li>
        </ul>
      )}
    </div>
  );
}
