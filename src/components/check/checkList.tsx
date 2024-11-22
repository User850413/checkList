'use client';

import { getChecks } from '@/app/services/checks';
import { useEffect, useState } from 'react';
import CheckListCard from './checkListCard';
import CheckInput from './checkInput';

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
    <>
      <ul>
        {list.map((check, index) => (
          <li key={check.id || index}>
            <CheckListCard task={check.task} isCompleted={check.isCompleted} />
          </li>
        ))}
      </ul>
      <CheckInput />
    </>
  );
}
