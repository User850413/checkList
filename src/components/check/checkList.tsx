'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import { getChecks } from '@/app/services/api/checks';
import { deleteTag } from '@/app/services/api/tags';
import { Check } from '@/types/check';
import { Tag } from '@/types/tag';

import CheckInput from './checkInput';
import CheckListCard from './checkListCard';
import TagNameInput from './tagNameInput';
import FieldButton from '../layout/fieldButton';

interface CheckListProp {
  tagName: string;
  tagId: string;
  interest: string;
}

function CheckList({ tagName, tagId, interest }: CheckListProp) {
  const [checkList, setCheckList] = useState<Check[]>([]);

  const queryClient = useQueryClient();

  const {
    isLoading,
    data: list,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['checks', tagId],
    queryFn: () => getChecks({ tagId }),
  });

  useEffect(() => {
    if (isSuccess) {
      setCheckList(list.data);
    }
  }, [list, isSuccess]);

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
  if (isError) return <div>Error</div>;

  return (
    <div className="h-full w-full rounded-lg bg-white px-3 py-2">
      <div className="border-b-2 border-b-slate-200">
        <div className="flex items-center justify-between">
          <TagNameInput tagName={tagName} tagId={tagId} />
          <button
            onClick={() => onClickDelete(tagId)}
            className="inline-block p-1 text-slate-400"
          >
            x
          </button>
        </div>
        <div className="flex w-full items-center gap-2 py-2">
          <FieldButton fieldName={interest} />
          <span>달성률</span>
        </div>
      </div>
      <ul className="my-3">
        {checkList?.map((check, index) => (
          <li key={check._id || index}>
            <CheckListCard
              id={check._id}
              task={check.task}
              isCompleted={check.isCompleted}
              tagId={check.tagId}
            />
          </li>
        ))}
      </ul>
      <div>
        <CheckInput tagId={tagId} />
      </div>
    </div>
  );
}

export default React.memo(CheckList);
