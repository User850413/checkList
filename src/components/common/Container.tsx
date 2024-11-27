import { PropsWithChildren } from 'react';

type ContainerProps = PropsWithChildren;

export default function Container({ children }: ContainerProps) {
  return (
    <div className="max-w-[1200px] w-screen bg-red-200 mx-auto">{children}</div>
  );
}
