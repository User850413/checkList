'use client';
import { Input } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { TagRequest } from '@/types/tag';

import { Field } from '../ui/field';

interface AddNewTagNameProps {
  onSubmit: Dispatch<SetStateAction<TagRequest>>;
}

export default function AddNewTagName({ onSubmit }: AddNewTagNameProps) {
  const tagNameRef = useRef<null | HTMLInputElement>(null);

  const onChangeInput = () => {
    if (tagNameRef.current && tagNameRef.current !== null) {
      const input = tagNameRef.current;
      onSubmit((prev) => ({ ...prev, name: input.value }));
    }
  };

  return (
    <div className="w-full">
      <Field label="리스트 명" orientation={'horizontal'}>
        <Input
          onChange={onChangeInput}
          type="text"
          className="flex w-full items-center bg-slate-100 px-1"
          ref={tagNameRef}
        />
      </Field>
    </div>
  );
}
