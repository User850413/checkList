import clsx from 'clsx';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface FieldButtonProps {
  fieldName: string;
  size?: 'lg' | 'md' | 'sm';
  deletable?: boolean;
  clickable?: boolean;
  isClicked?: boolean;
  onClickFn?: () => void;
}

export default function FieldButton({
  fieldName,
  size = 'md',
  deletable = false,
  onClickFn,
  clickable,
  isClicked = false,
}: FieldButtonProps) {
  const [clicked, setClicked] = useState<boolean>(isClicked);
  const closeButton = `${process.env.PUBLIC_URL || ''}/icons/x-round.svg`;

  if (deletable && !onClickFn)
    throw new Error('deletable에는 onClickFn이 필요합니다');

  const onClickButton = () => {
    onClickFn && onClickFn();
  };

  useEffect(() => {
    setClicked(isClicked);
  }, [isClicked]);

  return (
    <button
      className={clsx(
        'flex shrink-0 items-center gap-2 rounded-full',
        {
          'px-3 py-1 text-sm': size == 'md',
        },
        {
          'px-3 py-1 text-xs': size == 'sm',
        },
        {
          'px-4 py-2 text-lg': size == 'lg',
        },
        {
          'cursor-default bg-slate-200 text-slate-700': !clickable,
        },
        {
          'bg-slate-200 text-slate-700 hover:bg-slate-400':
            clickable && !clicked,
          'bg-slate-700 text-white hover:bg-slate-600': clickable && clicked,
        },
      )}
      type="button"
      onClick={deletable || clickable ? onClickButton : undefined}
    >
      <span>{fieldName}</span>
      {deletable && (
        <span className="relative h-5 w-5">
          <Image fill objectFit="cover" src={closeButton} alt="삭제" />
        </span>
      )}
    </button>
  );
}
