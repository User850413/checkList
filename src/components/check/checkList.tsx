'use client';

import { getChecks } from '@/app/services/checks';
import CheckListCard from './checkListCard';
import CheckInput from './checkInput';
import { useQuery } from '@tanstack/react-query';

export default function CheckList() {
  const { isLoading, data: list } = useQuery<CheckList>({
    queryKey: ['checks'],
    queryFn: () => getChecks(),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <ul>
        {list?.map((check, index) => (
          <li key={check.id || index}>
            <CheckListCard task={check.task} isCompleted={check.isCompleted} />
          </li>
        ))}
      </ul>
      <CheckInput />
    </>
  );
}
