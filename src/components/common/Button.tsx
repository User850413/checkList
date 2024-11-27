import { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface ButtonProps extends PropsWithChildren {
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  className,
  type = 'button',
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        'flex justify-center items-center rounded-md py-1 px-2 text-slate-800 shrink-0',
        {
          'bg-slate-200 cursor-pointer hover:bg-slate-300': !disabled,
          'bg-gray-300 text-gray-500 cursor-default': disabled,
        },
        className
      )}
    >
      {children}
    </button>
  );
}
