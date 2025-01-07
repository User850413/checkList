'use client';

import { FormEvent, useState } from 'react';

import AddNewTagDetail from './addNewTagDetail';
import AddNewTagName from './addNewTagName';
import StyledButton from '../common/styledButton';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postTag } from '@/app/services/api/tags';
import { TagRequest } from '@/types/tag';

interface TagInPutProps {
  Undo: () => void;
}

export function TagInput({ Undo }: TagInPutProps) {
  const [tagData, setTagData] = useState<TagRequest>({
    name: '',
    interest: '',
  });
  // NOTE : 하위 컴포넌트에 전달할 reset trigger
  const [trigger, setTrigger] = useState<boolean>(false);

  const queryClient = useQueryClient();

  // NOTE : post tag 뮤테이션
  const { mutate: tagMutate } = useMutation({
    mutationFn: ({ name, interest }: TagRequest) => postTag({ name, interest }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['interests', 'mine'] });
    },
    onError: (error) => {
      console.log(`태그 추가 실패 : ${error.message}`);
    },
  });

  const onHandleSubmit = (e: FormEvent) => {
    e.preventDefault();
    tagMutate(tagData);
    Undo();
    setTagData({ name: '', interest: '' });
    setTrigger(true);
  };

  return (
    <form
      onSubmit={onHandleSubmit}
      className="flex flex-col items-center gap-5 rounded-lg p-2"
    >
      <AddNewTagName
        onChange={setTagData}
        trigger={trigger}
        setTrigger={setTrigger}
      />
      <AddNewTagDetail
        onChange={setTagData}
        trigger={trigger}
        setTrigger={setTrigger}
      />
      <StyledButton type="submit" size="md">
        추가
      </StyledButton>
    </form>
  );
}
