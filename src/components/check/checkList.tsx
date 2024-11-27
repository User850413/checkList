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
    <div className="bg-white rounded-lg w-full px-3 h-full py-2">
      <h1 className="border-b-slate-200 border-b-2 font-medium text-2xl py-1">
        {tag}
      </h1>
      <ul className="my-3">
        {list?.map((check, index) => (
          <li key={check._id || index}>
            <CheckListCard
              id={check._id}
              task={check.task}
              isCompleted={check.isCompleted}
              tag={check.tag}
            />
          </li>
        ))}
      </ul>
      <div>
        <CheckInput tag={tag} />
      </div>
    </div>
  );
}
