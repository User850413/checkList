'use client';
import { Input } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { TagRequest } from '@/types/tag';

import { Field } from '../ui/field';

interface AddNewTagNameProps {
  onChange: Dispatch<SetStateAction<TagRequest>>;
  trigger: boolean; // NOTE : 상위 컴포넌트 상태 변경 시 reset trigger
  setTrigger: Dispatch<SetStateAction<boolean>>;
}

export default function AddNewTagName({
  onChange,
  trigger,
  setTrigger,
}: AddNewTagNameProps) {
  const tagNameRef = useRef<null | HTMLInputElement>(null);

  const onChangeInput = () => {
    if (tagNameRef.current && tagNameRef.current !== null) {
      const input = tagNameRef.current;
      onChange((prev) => ({ ...prev, name: input.value }));
    }
  };

  useEffect(() => {
    if (trigger) {
      if (tagNameRef.current) tagNameRef.current.value = '';
    }
  }, [trigger]);

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
