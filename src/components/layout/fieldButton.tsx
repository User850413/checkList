import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface FieldButtonProps {
  fieldName: string;
  size?: 'lg' | 'md' | 'sm';
  deletable?: boolean;
  deleteFn?: () => void;
}

export default function FieldButton({
  fieldName,
  size = 'md',
  deletable = false,
  deleteFn,
}: FieldButtonProps) {
  const closeButton = `${process.env.PUBLIC_URL || ''}/icons/x-round.svg`;

  if (deletable && !deleteFn)
    throw new Error('deletable에는 deleteFn이 필요합니다');

  return (
    <button
      className={clsx(
        'flex  items-center gap-2  bg-slate-200 hover:bg-slate-300 rounded-full',
        {
          'text-sm px-3 py-1': size == 'md',
        },
        {
          'text-xs px-3 py-1': size == 'sm',
        },
        {
          'text-lg px-4 py-2': size == 'lg',
        }
      )}
      type="button"
      onClick={deletable ? deleteFn : undefined}
    >
      <span>{fieldName}</span>
      {deletable && (
        <span className="relative w-5 h-5">
          <Image fill objectFit="cover" src={closeButton} alt="삭제" />
        </span>
      )}
    </button>
  );
}
