'use client';

import { FormEvent, useState } from 'react';

import AddNewTagDetail from './addNewTagDetail';
import AddNewTagName from './addNewTagName';
import StyledButton from '../common/styledButton';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postTag } from '@/app/services/api/tags';
import { Tag, TagRequest } from '@/types/tag';

interface TagInPutProps {
  Undo: () => void;
}

export function TagInput({ Undo }: TagInPutProps) {
  const [tagData, setTagData] = useState<TagRequest>({
    name: '',
    interest: '',
  });
  const queryClient = useQueryClient();

  // NOTE : post tag 뮤테이션
  const { mutate: tagMutate } = useMutation({
    mutationFn: ({ name }: Pick<Tag, 'name'>) => postTag({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (error) => {
      console.log(`태그 추가 실패 : ${error.message}`);
    },
  });

  const onHandleSubmit = (e: FormEvent) => {
    e.preventDefault();
    tagMutate(tagData);
    Undo();
  };

  return (
    <form
      onSubmit={onHandleSubmit}
      className="flex flex-col items-center gap-5 rounded-lg p-2"
    >
      <AddNewTagName onSubmit={setTagData} />
      <AddNewTagDetail onSubmit={setTagData} />
      <StyledButton type="submit" size="md">
        추가
      </StyledButton>
    </form>
  );
}
