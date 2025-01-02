'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useRef, useState } from 'react';

import { postChecks } from '@/app/services/api/checks';
import { Check } from '@/types/check';

import StyledButton from '../common/styledButton';

// NOTE: 체크 가능 항목을 신규 추가하는 컴포넌트

interface CheckInputProps {
  tagId: string;
}

function CheckInput({ tagId }: CheckInputProps) {
  const queryClient = useQueryClient();
  const [task, setTask] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: ({ task, tagId }: Partial<Check>) =>
      postChecks({ task, tagId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checks', tagId] });
    },
    onError: (err) => {
      console.log(`항목 추가 실패 : ${err}`);
    },
  });

  const inputRef = useRef<null | HTMLInputElement>(null);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const onClickDelete = () => {
    setTask('');
  };

  const onHandleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!task) return;
    mutate({ task, tagId });
    setTask('');
  };

  return (
    <form onSubmit={onHandleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        className="w-full rounded-md border-2 border-slate-200"
        ref={inputRef}
        onChange={onChangeInput}
        value={task}
      />

      <StyledButton type="button" onClick={onClickDelete} disabled={isPending}>
        x
      </StyledButton>
      <StyledButton type="submit" disabled={isPending}>
        확인
      </StyledButton>
    </form>
  );
}

export default React.memo(CheckInput);
