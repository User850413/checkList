'use client';

import { useEffect } from 'react';
import { checkToken } from './services/api/status';

export default function Home() {
  useEffect(() => {
    checkToken().catch((error) => console.error(error));
  }, []);

  return <>Loading...</>;
}
