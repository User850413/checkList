'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

import { deleteCheck } from '@/app/services/api/checks';
import { Check } from '@/types/check';
import StyledButton from '../common/styledButton';
import Image from 'next/image';

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
    <div className="flex items-center justify-between gap-5 text-sm">
      <div className="flex shrink-0 items-center gap-2">
        <input type="checkbox" checked={checked} onChange={onClickCard} />
        <div className="cursor-pointer" onClick={onClickCard}>
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
