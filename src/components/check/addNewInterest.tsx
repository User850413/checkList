'use client';
import { getAllInterest } from '@/app/services/api/interests';
import { Input } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';

export default function AddNewInterest() {
  const [addStart, setAddStart] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const plusButton = `${process.env.PUBLIC_URL || ''}/icons/plus-round.svg`;
  const closeButton = `${process.env.PUBLIC_URL || ''}/icons/x-round.svg`;

  const inputInterestRef = useRef<null | HTMLInputElement>(null);

  const { mutate: getInterestMutate } = useMutation({
    mutationFn: () => getAllInterest(),
    mutationKey: ['interests'],
    onError: (err) => console.error(err.message),
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const onClickTest = async () => {
    console.log('clicked!');
    getInterestMutate();
  };

  const onChangeInterestInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  function debounce<T extends () => void>(func: T) {
    let timer: NodeJS.Timeout | null = null;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        func.apply(this, args);
      }, 1000);
    };
  }
  const clickDebounce = debounce(() => onClickTest());

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
        <Input
          type="text"
          variant="subtle"
          ref={inputInterestRef}
          onChange={onChangeInterestInput}
        />
        <button onClick={clickDebounce}>관심사 불러오기 버튼</button>
      </div>
    </>
  );
}
