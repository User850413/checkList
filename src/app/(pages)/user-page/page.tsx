'use client';

import Header from '@/components/layout/header';
import UserProfile from './userProfile';
import TagBundle from '@/components/tag/tagBundle';

export default function UserPage() {
  return (
    <>
      <Header />
      <header>
        <UserProfile />
      </header>
      <main>
        <TagBundle />
      </main>
    </>
  );
}
