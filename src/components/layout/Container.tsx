import { PropsWithChildren } from 'react';

type ContainerProps = PropsWithChildren;

export default function Container({ children }: ContainerProps) {
  return (
    <div className="relative pt-16 max-w-[1200px] min-w-[480px] h-screen w-screen mx-auto bg-slate-50 ">
      {children}
    </div>
  );
}
