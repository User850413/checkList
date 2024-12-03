'use client';
import { deleteCheck } from '@/app/services/api/checks';
import { Check } from '@/types/check';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

interface CheckListCardProps {
  id: string;
  task: string;
  isCompleted: boolean;
  tagId: string;
}

function CheckListCard({ id, task, isCompleted, tagId }: CheckListCardProps) {
  const queryClient = useQueryClient();

  const [checked, setChecked] = useState(isCompleted);
  const { mutate } = useMutation({
    mutationFn: ({ _id }: Pick<Check, '_id'>) => deleteCheck({ _id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checks', tagId] });
    },
    onError: (err) => {
      console.log(`항목 삭제 실패 : ${err}`);
    },
  });

  const onClickCard = () => {
    setChecked((prev) => !prev);
  };

  const onClickDelete = (_id: string) => {
    mutate({ _id });
  };

  return (
    <div className="flex items-center text-sm gap-2">
      <input type="checkbox" checked={checked} onChange={onClickCard} />
      <div className="cursor-pointer" onClick={onClickCard}>
        {task}
      </div>
      <button onClick={() => onClickDelete(id)}>삭제</button>
    </div>
  );
}

export default React.memo(CheckListCard);
