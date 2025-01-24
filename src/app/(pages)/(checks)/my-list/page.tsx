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
import { useEffect, useState } from 'react';

export default function MyList() {
  const [scrolled, setScrolled] = useState(false);
  const PLUS = `${process.env.PUBLIC_URL || ''}/icons/plus.svg`;
  const ARROW_TOP = `${process.env.PUBLIC_URL || ''}/icons/arrow-top.svg`;

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <>
      {scrolled && (
        <FloatingButton
          classNames="bottom-[76px]"
          onClickFn={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="페이지 상단으로 이동"
        >
          <span className="relative h-6 w-6">
            <Image src={ARROW_TOP} alt="상단으로 이동" fill />
          </span>
        </FloatingButton>
      )}
      <DialogRoot placement={'center'}>
        <DialogTrigger aria-label="새 태그 추가하기">
          <FloatingButton>
            <span className="relative h-full w-full">
              <Image src={PLUS} alt="새 태그 추가" fill />
            </span>
          </FloatingButton>
        </DialogTrigger>
        <DialogContent aria-label="태그 입력 폼">
          <DialogBody>
            <TagInput />
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      <main className="pt-6">
        <TagBundle />
      </main>
    </>
  );
}
