'use client';

import clsx from 'clsx';
import { useState } from 'react';

import { TagInput } from './tagInput';
import StyledButton from '../common/styledButton';

export default function AddNewTagWrapper() {
  const [addTag, setAddTag] = useState<boolean>(false);

  const onCancelEdit = () => {
    setAddTag(false);
  };

  return (
    <>
      <div
        className={clsx(
          'flex flex-col gap-2 rounded-lg bg-slate-100 px-2 py-4',
          { hidden: !addTag },
        )}
      >
        <div className="flex items-center justify-between">
          <h1 className="w-fit text-lg font-medium">새 리스트 추가</h1>
          <button
            className="px-3 py-1 text-sm text-red-400"
            onClick={onCancelEdit}
            aria-label="태그 추가 취소"
          >
            취소
          </button>
        </div>
        <TagInput Undo={onCancelEdit} />
      </div>
      <StyledButton
        className={clsx('h-full w-full', { hidden: addTag })}
        onClick={() => setAddTag(true)}
        aria-label="새 리스트 추가"
      >
        +
      </StyledButton>
    </>
  );
}
