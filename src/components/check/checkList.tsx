'use client';

import { getChecks } from '@/app/services/api/checks';
import CheckListCard from './checkListCard';
import CheckInput from './checkInput';
import { useQuery } from '@tanstack/react-query';
import { Check } from '@/types/check';

interface CheckListProp {
  tag: string;
}

export default function CheckList({ tag }: CheckListProp) {
  const { isLoading, data: list } = useQuery<Check[]>({
    queryKey: ['checks', tag],
    queryFn: () => getChecks({ tag }),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-red-200 w-full">
      <h1>{tag}</h1>
      <ul>
        {list?.map((check, index) => (
          <li key={check.id || index}>
            <CheckListCard task={check.task} isCompleted={check.isCompleted} />
          </li>
        ))}
      </ul>
      <CheckInput tag={tag} />
    </div>
  );
}
