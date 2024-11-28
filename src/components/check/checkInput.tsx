'use client';

import { postChecks } from '@/app/services/api/checks';
import { Check } from '@/types/check';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useRef, useState } from 'react';
import Button from '../common/Button';

// NOTE: 체크 가능 항목을 신규 추가하는 컴포넌트

interface CheckInputProps {
  tagId: string;
  tagName: string;
}

export default function CheckInput({ tagId, tagName }: CheckInputProps) {
  const queryClient = useQueryClient();

  const [task, setTask] = useState('');
  const { mutate, isPending } = useMutation({
    mutationFn: ({ task, tagId }: Partial<Check>) =>
      postChecks({ task, tagId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checks', tagName] });
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
        className="border-2 border-slate-200 rounded-md w-full"
        ref={inputRef}
        onChange={onChangeInput}
        value={task}
      />

      <Button type="button" onClick={onClickDelete} disabled={isPending}>
        x
      </Button>
      <Button type="submit" disabled={isPending}>
        확인
      </Button>
    </form>
  );
}
