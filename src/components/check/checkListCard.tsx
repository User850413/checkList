'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

import { deleteCheck } from '@/app/services/api/checks';
import { Check } from '@/types/check';
import StyledButton from '../common/styledButton';
import Image from 'next/image';
import clsx from 'clsx';

interface CheckListCardProps {
  id: string;
  task: string;
  isCompleted: boolean;
  tagId: string;
}

function CheckListCard({ id, task, isCompleted, tagId }: CheckListCardProps) {
  const queryClient = useQueryClient();
  const [checked, setChecked] = useState(isCompleted);

  const closeButton = `${process.env.PUBLIC_URL || ''}/icons/x-round.svg`;
  const checkIcon = `${process.env.PUBLIC_URL || ''}/icons/check-round.svg`;

  // NOTE : 항목 삭제 mutate
  const { mutate: deleteMutate } = useMutation({
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
    deleteMutate({ _id });
  };

  return (
    <div className="flex items-center justify-between gap-5 text-sm">
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => setChecked((prev) => !prev)}
          className={clsx('relative h-[18px] w-[18px] rounded-full', {
            'border-2 border-gray-300': !checked,
          })}
        >
          {checked && <Image fill src={checkIcon} alt={'완료'} />}
        </button>
        <div
          className={clsx('cursor-pointer', {
            'text-gray-500 line-through': checked,
          })}
          onClick={onClickCard}
        >
          {task}
        </div>
      </div>
      <span className="h-0 w-full border-b-2 border-dashed border-b-slate-100" />
      <StyledButton onClick={() => onClickDelete(id)} size="xs" color="default">
        <span className="relative h-4 w-4">
          <Image src={closeButton} alt={`${task} 항목 삭제`} fill />
        </span>
      </StyledButton>
    </div>
  );
}

export default React.memo(CheckListCard);
