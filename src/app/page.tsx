'use client';

import { useEffect } from 'react';
import { checkToken } from './services/api/status';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const getStatus = async () => {
      const result = await checkToken().catch((error) => console.error(error));
      if (result.authentication === false) {
        router.push('/landing');
      } else {
        router.push('/my-list');
      }
    };

    getStatus();
  }, []);

  return <>Loading...</>;
}
