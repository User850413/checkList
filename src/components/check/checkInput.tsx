'use client';

import { postChecks } from '@/app/services/api/checks';
import { Check } from '@/types/check';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useRef, useState } from 'react';

// NOTE: 체크 가능 항목을 신규 추가하는 컴포넌트

interface CheckInputProps {
  tag: string;
}

export default function CheckInput({ tag }: CheckInputProps) {
  const queryClient = useQueryClient();

  const [task, setTask] = useState('');
  const { mutate } = useMutation({
    mutationFn: ({ task }: Partial<Check>) => postChecks({ tag, task }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checks'] });
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
    mutate({ task });
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

      <input
        type="button"
        value="x"
        className="py-1 px-3 relative items-center flex justify-center bg-slate-200 rounded-md cursor-pointer"
        onClick={onClickDelete}
      />
      <button className="px-2 py-1 relative items-center flex justify-center bg-slate-200 rounded-md shrink-0">
        확인
      </button>
    </form>
  );
}
