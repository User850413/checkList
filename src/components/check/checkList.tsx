'use client';

import { getChecks } from '@/app/services/api/checks';
import CheckListCard from './checkListCard';
import CheckInput from './checkInput';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check } from '@/types/check';
import { deleteTag } from '@/app/services/api/tags';
import { Tag } from '@/types/tag';

interface CheckListProp {
  tag: string;
  id: string;
}

export default function CheckList({ tag, id }: CheckListProp) {
  const queryClient = useQueryClient();

  const { isLoading, data: list } = useQuery<Check[]>({
    queryKey: ['checks', tag],
    queryFn: () => getChecks({ tag }),
  });

  const { mutate } = useMutation({
    mutationFn: ({ _id }: Pick<Tag, '_id'>) => deleteTag({ _id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (err) => {
      console.log(`항목 삭제 실패: ${err}`);
    },
  });

  const onClickDelete = (_id: string) => {
    mutate({ _id });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg w-full px-3 h-full py-2">
      <div className="border-b-slate-200 border-b-2 flex justify-between items-center">
        <h1 className="w-full font-medium text-2xl py-1">{tag}</h1>
        <button
          onClick={() => onClickDelete(id)}
          className="inline-block p-1 text-slate-400"
        >
          x
        </button>
      </div>
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
