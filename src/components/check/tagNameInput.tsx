'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import React, { FormEvent, useRef, useState } from 'react';

import { patchTag } from '@/app/services/api/tags';
import { Tag } from '@/types/tag';

import StyledButton from '../common/styledButton';
import { QueryKeys } from '@/app/lib/constants/queryKeys';

interface TagNameInputProps {
  tagName: string;
  tagId: string;
}

function TagNameInput({ tagName, tagId }: TagNameInputProps) {
  const queryClient = useQueryClient();

  const [tagNameEditing, setTagNameEditing] = useState<boolean>(false);
  const [tagValue, setTagValue] = useState<string>(tagName);

  const InputRef = useRef<HTMLInputElement | null>(null);

  const { mutate } = useMutation({
    mutationFn: ({ _id, name }: Partial<Tag>) => patchTag({ _id, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.TAGS });
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
    const trimmedValue = tagValue.trim();
    if (trimmedValue === '') return;
    if (trimmedValue === tagName) {
      setTagNameEditing(false);
      return;
    }
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
        <h1 className="w-full py-1 text-2xl font-medium">{tagName}</h1>
        <button
          className="shrink-0 cursor-pointer text-sm"
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
          aria-label="리스트명 입력"
          placeholder="리스트명은 1자 이상이어야 합니다"
          maxLength={50}
        />
        <StyledButton type="submit">수정</StyledButton>
        <StyledButton type="button" onClick={() => onClickCancel()}>
          취소
        </StyledButton>
      </form>
    </>
  );
}

export default React.memo(TagNameInput);
