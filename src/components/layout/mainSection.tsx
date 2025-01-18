import clsx from 'clsx';
import { ReactNode } from 'react';

interface MainSectionProps {
  textArray?: 'right' | 'left';
  lettering: ReactNode;
}

export default function MainSection({
  textArray = 'right',
  lettering,
}: MainSectionProps) {
  return (
    <div className="flex w-full items-center justify-center bg-red-50 px-36">
      <div
        className={clsx('flex min-h-[400px] w-full gap-5', {
          'flex-row': textArray === 'right',
          'flex-row-reverse': textArray === 'left',
        })}
      >
        <div className="flex-1 bg-blue-300">이미지</div>
        <div
          className={clsx(
            {
              'text-left': textArray === 'right',
              'text-right': textArray === 'left',
            },
            'my-auto w-max flex-1 cursor-default text-pretty bg-green-200 text-2xl',
          )}
        >
          {lettering}
        </div>
      </div>
    </div>
  );
}
