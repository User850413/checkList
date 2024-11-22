'use client';

import { postChecks } from '@/app/services/checks';
import { FormEvent, useRef, useState } from 'react';

// NOTE: 체크 가능 항목을 신규 추가하는 컴포넌트

export default function CheckInput() {
  const [task, setTask] = useState('');

  const inputRef = useRef<null | HTMLInputElement>(null);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const onClickDelete = () => {
    setTask('');
  };

  const onHandleSubmit = (e: FormEvent) => {
    e.preventDefault();
    postChecks({ task });
  };

  return (
    <form onSubmit={onHandleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        className="border-2 border-gray-500"
        ref={inputRef}
        onChange={onChangeInput}
        value={task}
      />

      <input
        type="button"
        value="x"
        className="py-1 px-3 relative items-center flex justify-center bg-gray-400 cursor-pointer"
        onClick={onClickDelete}
      />
      <button className="px-2 py-1 relative items-center flex justify-center bg-gray-400">
        확인
      </button>
    </form>
  );
}
