import clsx from 'clsx';
import Image from 'next/image';
import { ReactNode } from 'react';

interface MainSectionProps {
  textArray?: 'right' | 'left';
  lettering: ReactNode;
  imageUrl: string;
  imageAlt: string;
}

export default function MainSection({
  textArray = 'right',
  lettering,
  imageUrl,
  imageAlt,
}: MainSectionProps) {
  return (
    <div className="flex w-full items-center justify-center px-36">
      <div
        className={clsx('flex min-h-[400px] w-full gap-5', {
          'flex-row': textArray === 'right',
          'flex-row-reverse': textArray === 'left',
        })}
      >
        <div className="relative flex-1 bg-blue-300">
          <Image src={imageUrl} alt={imageAlt} fill objectFit="cover" />
        </div>
        <div
          className={clsx(
            {
              'text-left': textArray === 'right',
              'text-right': textArray === 'left',
            },
            'my-auto w-max flex-1 cursor-default text-pretty text-2xl',
          )}
        >
          {lettering}
        </div>
      </div>
    </div>
  );
}
