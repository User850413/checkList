import { PropsWithChildren } from 'react';

type ContainerProps = PropsWithChildren;

export default function Container({ children }: ContainerProps) {
  return (
    <div className="max-w-[1200px] min-w-[480px] w-screen mx-auto">
      {children}
    </div>
  );
}
