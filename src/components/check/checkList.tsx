'use client';

import { getAllChecks } from '@/app/services/api/checks';
import CheckListCard from './checkListCard';
import CheckInput from './checkInput';
import { useQuery } from '@tanstack/react-query';

export default function CheckList() {
  const { isLoading, data: list } = useQuery<CheckList>({
    queryKey: ['checks'],
    queryFn: () => getAllChecks(),
  });

  const tag = 'DEFAULT';
  // console.log(list);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <h1></h1>
      <ul>
        {list?.map((check, index) => (
          <li key={check.id || index}>
            <CheckListCard task={check.task} isCompleted={check.isCompleted} />
          </li>
        ))}
      </ul>
      <CheckInput tag={tag} />
    </>
  );
}
