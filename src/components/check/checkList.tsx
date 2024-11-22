'use client';

import { getChecks } from '@/app/services/checks';
import { useEffect, useState } from 'react';

export default function CheckList() {
  const [list, setList] = useState<CheckList | []>([]);

  useEffect(() => {
    const getList = async () => {
      const test = await getChecks();
      setList(test);
    };

    getList();
  }, []);

  return (
    <ul>
      {list.map((check, index) => (
        <li key={check.id || index}>- {check.task}</li>
      ))}
    </ul>
  );
}
