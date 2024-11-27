import { PropsWithChildren } from 'react';

interface ButtonProps extends PropsWithChildren {
  onClick: () => void;
}

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex justify-center items-center bg-slate-200 rounded-md py-1 px-2 text-slate-800 shrink-0"
    >
      {children}
    </button>
  );
}
