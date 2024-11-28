'use client';

import clsx from 'clsx';
import React, { FormEvent, useRef, useState } from 'react';
import Button from '../common/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchTag } from '@/app/services/api/tags';
import { Tag } from '@/types/tag';

interface TagNameInputProps {
  tagName: string;
  tagId: string;
}

function TagNameInput({ tagName, tagId }: TagNameInputProps) {
  const queryClient = useQueryClient();

  const [tagNameEditing, setTagNameEditing] = useState<boolean>(false);
  const [tagValue, setTagValue] = useState<string>(tagName);

  const InputRef = useRef(null);

  const { mutate } = useMutation({
    mutationFn: ({ _id, name }: Partial<Tag>) => patchTag({ _id, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setTagNameEditing(false);
    },
    onError: (error) => {
      console.error(`태그 수정 실패 : ${error}`);
    },
  });

  const onClickStartEdit = () => {
    setTagNameEditing(true);
  };

  const onClickEditTagName = (e: FormEvent) => {
    e.preventDefault();
    if (tagValue === '') return;
    mutate({ _id: tagId, name: tagValue });
  };

  const onClickCancel = () => {
    setTagNameEditing(false);
  };

  const onTagNameValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagValue(e.target.value);
  };

  return (
    <>
      <div
        className={clsx('flex items-center gap-5', { hidden: tagNameEditing })}
      >
        <h1 className="w-full font-medium text-2xl py-1">{tagName}</h1>
        <button
          className="text-sm shrink-0 cursor-pointer"
          onClick={onClickStartEdit}
        >
          수정
        </button>
      </div>
      <form
        className={clsx({ hidden: !tagNameEditing }, 'flex items-center gap-2')}
        onSubmit={onClickEditTagName}
      >
        <input
          type="text"
          className="border-2 border-slate-300"
          ref={InputRef}
          onChange={onTagNameValueChange}
          value={tagValue}
        />
        <Button type="submit">수정</Button>
        <Button type="button" onClick={() => onClickCancel()}>
          취소
        </Button>
      </form>
    </>
  );
}

export default React.memo(TagNameInput);
