'use client';

import Header from '@/components/layout/header';
import UserProfile from './userProfile';
import UserInterestChart from '@/components/user/userInterestChart';

export default function UserPage() {
  return (
    <>
      <Header />
      <header>
        <UserProfile />
      </header>
      <main>
        <UserInterestChart />
      </main>
    </>
  );
}
