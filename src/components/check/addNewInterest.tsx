'use client';
import { Input } from '@chakra-ui/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

export default function AddNewInterest() {
  const [addStart, setAddStart] = useState<boolean>(false);
  const plusButton = `${process.env.PUBLIC_URL || ''}/icons/plus-round.svg`;
  const closeButton = `${process.env.PUBLIC_URL || ''}/icons/x-round.svg`;

  //   const onClickTest = () => {
  //     console.log('clicked!');
  //   };

  return (
    <>
      <button
        className={clsx('relative w-14 h-14 rounded-full', {
          hidden: addStart,
          block: !addStart,
        })}
        onClick={() => setAddStart(true)}
      >
        <Image fill objectFit="cover" src={plusButton} alt="관심사 추가" />
      </button>
      <div
        className={clsx(
          {
            hidden: !addStart,
            block: addStart,
          },
          'bg-white relative w-[500px] p-6 flex flex-col gap-2'
        )}
      >
        <div className="flex justify-between items-center">
          <h4>새 관심사 추가</h4>
          <button
            className="relative w-5 h-5"
            onClick={() => setAddStart(false)}
          >
            <Image
              fill
              objectFit="cover"
              src={closeButton}
              alt="관심사 추가 취소"
            />
          </button>
        </div>
        <Input type="text" variant="subtle" />
        {/* <button onClick={onClickTest}>관심사 불러오기 버튼</button> */}
      </div>
    </>
  );
}
