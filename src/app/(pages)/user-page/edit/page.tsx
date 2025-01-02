'use client';

import Header from '@/components/layout/header';
import UserEditForm from '@/components/userForm/userEditForm';

export default function Edit() {
  return (
    <>
      <Header />
      <main className="w-full px-10 pt-10">
        <UserEditForm />
      </main>
    </>
  );
}
