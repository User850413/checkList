'use client';

import clsx from 'clsx';
import { TagInput } from './tagInput';
import { useState } from 'react';
import Button from '../common/Button';

export default function AddNewTag() {
  const [addTag, setAddTag] = useState<boolean>(false);

  const onCancelEdit = () => {
    setAddTag(false);
  };

  return (
    <>
      <div
        className={clsx(
          'bg-slate-100 px-2 py-4 rounded-lg flex flex-col gap-2',
          { hidden: !addTag }
        )}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium w-fit">새 리스트 추가</h1>
          <button
            className="text-sm px-3 py-1 text-red-400"
            onClick={onCancelEdit}
            aria-label="태그 추가 취소"
          >
            취소
          </button>
        </div>
        <TagInput Undo={onCancelEdit} />
      </div>
      <Button
        className={clsx('w-full h-full', { hidden: addTag })}
        onClick={() => setAddTag(true)}
        aria-label="새 리스트 추가"
      >
        +
      </Button>
    </>
  );
}
