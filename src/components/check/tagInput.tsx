'use client';

import { postTag } from '@/app/services/api/tags';
import { Tag } from '@/types/tag';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useRef, useState } from 'react';
import Button from '../common/Button';

interface TagInPutProps {
  Undo?: () => void;
}

export function TagInPut({ Undo }: TagInPutProps) {
  const queryClient = useQueryClient();

  const [tagName, setTagName] = useState('');
  const { mutate } = useMutation({
    mutationFn: ({ name }: Pick<Tag, 'name'>) => postTag({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (error) => {
      console.log(`태그 추가 실패 : ${error}`);
    },
  });

  const inputRef = useRef<null | HTMLInputElement>(null);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagName(e.target.value);
  };

  const onHandleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!tagName) return;
    mutate({ name: tagName });
    setTagName('');
    if (Undo) Undo();
  };

  return (
    <form onSubmit={onHandleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        ref={inputRef}
        value={tagName}
        onChange={onChangeInput}
        className="w-full border-slate-200 border-2 rounded-md"
      />
      <Button type="submit">추가</Button>
    </form>
  );
}
