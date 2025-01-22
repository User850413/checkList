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

  return (
    <>
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
      <main>
        <TagBundle />
      </main>
    </>
  );
}
