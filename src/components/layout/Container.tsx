import { PropsWithChildren } from 'react';

type ContainerProps = PropsWithChildren;

export default function Container({ children }: ContainerProps) {
  return (
    <div className="relative mx-auto h-full min-h-screen w-screen min-w-[480px] max-w-[1200px] bg-slate-50 pt-16">
      {children}
    </div>
  );
}
