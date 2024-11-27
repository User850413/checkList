import { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface ButtonProps extends PropsWithChildren {
  onClick: () => void;
  className?: string;
}

export default function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex justify-center items-center bg-slate-200 rounded-md py-1 px-2 text-slate-800 shrink-0',
        className
      )}
    >
      {children}
    </button>
  );
}
