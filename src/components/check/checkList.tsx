'use client';

import { getChecks } from '@/app/services/api/checks';
import CheckListCard from './checkListCard';
import CheckInput from './checkInput';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check } from '@/types/check';
import { deleteTag } from '@/app/services/api/tags';
import { Tag } from '@/types/tag';
import TagNameInput from './tagNameInput';
import React from 'react';

interface CheckListProp {
  tagName: string;
  tagId: string;
}

function CheckList({ tagName, tagId }: CheckListProp) {
  const queryClient = useQueryClient();

  const { isLoading, data: list } = useQuery<Check[]>({
    queryKey: ['checks', tagId],
    queryFn: () => getChecks({ tagId }),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: ({ _id }: Pick<Tag, '_id'>) => deleteTag({ _id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (err) => {
      console.log(`항목 삭제 실패: ${err}`);
    },
  });

  const onClickDelete = (_id: string) => {
    deleteMutate({ _id });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg w-full px-3 h-full py-2">
      <div className="border-b-slate-200 border-b-2 flex justify-between items-center">
        <TagNameInput tagName={tagName} tagId={tagId} />
        <button
          onClick={() => onClickDelete(tagId)}
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
              tag={tagName}
            />
          </li>
        ))}
      </ul>
      <div>
        <CheckInput tagId={tagId} tagName={tagName} />
      </div>
    </div>
  );
}

export default React.memo(CheckList);
