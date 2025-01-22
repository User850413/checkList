'use client';

import { TagInput } from '@/components/check/tagInput';
import FloatingButton from '@/components/common/floatingButton';
import TagBundle from '@/components/tag/tagBundle';
import {
  DialogBody,
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog';

import Image from 'next/image';

export default function MyList() {
  const PLUS = `${process.env.PUBLIC_URL || ''}/icons/plus.svg`;
  const ARROW_TOP = `${process.env.PUBLIC_URL || ''}/icons/arrow-top.svg`;

  return (
    <>
      <div className="flex flex-col items-center">
        <FloatingButton
          classNames="bottom-20"
          onClickFn={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="relative h-6 w-6">
            <Image src={ARROW_TOP} alt="상단으로" fill />
          </span>
        </FloatingButton>
        <DialogRoot placement={'center'}>
          <DialogTrigger>
            <FloatingButton>
              <span className="relative h-full w-full">
                <Image src={PLUS} alt="새 태그 추가" fill />
              </span>
            </FloatingButton>
          </DialogTrigger>
          <DialogContent>
            <DialogBody>
              <TagInput />
            </DialogBody>
          </DialogContent>
        </DialogRoot>
      </div>
      <main className="pt-6">
        <TagBundle />
      </main>
    </>
  );
}
