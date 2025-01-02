'use client';

import { FormEvent, useState } from 'react';

import AddNewTagDetail from './addNewTagDetail';
import AddNewTagName from './addNewTagName';
import StyledButton from '../common/styledButton';

interface TagInPutProps {
  Undo?: () => void;
}

export function TagInput({ Undo }: TagInPutProps) {
  const [trigger1, setTrigger1] = useState<boolean>(false);
  const [trigger2, setTrigger2] = useState<boolean>(false);

  const onHandleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTrigger1(true);
    setTrigger2(true);
  };

  return (
    <form
      onSubmit={onHandleSubmit}
      className="flex flex-col items-center gap-5 bg-red-50"
    >
      <AddNewTagName
        trigger={trigger1}
        onTriggered={() => setTrigger1(false)}
      />
      <AddNewTagDetail />
      {/* <div className="flex items-center w-full">
        <input
          type="text"
          ref={inputRef}
          value={tagName}
          onChange={onChangeInput}
          className="w-full border-slate-200 border-2 rounded-md"
        />
      </div> */}
      <StyledButton type="submit">추가</StyledButton>
    </form>
  );
}
