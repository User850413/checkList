'use client';
import { Input } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { postTag } from '@/app/services/api/tags';
import { Tag } from '@/types/tag';

import { Field } from '../ui/field';

interface AddNewTagNameProps {
  trigger: boolean;
  onTriggered: () => void;
}

export default function AddNewTagName({
  trigger,
  onTriggered,
}: AddNewTagNameProps) {
  const [tagNameValue, setTagNameValue] = useState<string>('');
  const tagNameRef = useRef<null | HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const onChangeInput = () => {
    setTagNameValue(tagNameRef.current?.value || '');
  };

  const { mutate: tagMutate } = useMutation({
    mutationFn: ({ name }: Pick<Tag, 'name'>) => postTag({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (error) => {
      console.log(`태그 추가 실패 : ${error.message}`);
    },
    onSettled: () => onTriggered(),
  });

  useEffect(() => {
    if (trigger) {
      if (tagNameValue) {
        tagMutate({ name: tagNameValue });
        setTagNameValue('');
      } else {
        onTriggered();
      }
    }
  }, [trigger, tagMutate, tagNameValue, onTriggered]);

  return (
    <div className="w-full">
      <Field label="리스트 명" orientation={'horizontal'}>
        <Input
          onChange={onChangeInput}
          type="text"
          className="flex w-full items-center bg-slate-100 px-1"
          ref={tagNameRef}
          value={tagNameValue}
        />
      </Field>
    </div>
  );
}
