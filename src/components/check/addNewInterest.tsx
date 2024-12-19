'use client';
import { getAllInterest, postInterest } from '@/app/services/api/interests';
import { Input } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import StyledButton from '../common/styledButton';
import { interest, interestResponse } from '@/types/interest';

export default function AddNewInterest() {
  const [addStart, setAddStart] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const [autoCompleteValue, setAutoCompleteValue] = useState<interest[]>([]);

  const plusButton = `${process.env.PUBLIC_URL || ''}/icons/plus-round.svg`;
  const closeButton = `${process.env.PUBLIC_URL || ''}/icons/x-round.svg`;

  const inputInterestRef = useRef<null | HTMLInputElement>(null);

  // NOTE : interest 불러오는 mutation
  const { mutate: getInterestMutate } = useMutation({
    mutationFn: () => getAllInterest(),
    mutationKey: ['interests'],
    onError: (err) => console.error(err.message),
    onSuccess: (data: interestResponse) => {
      console.log(data.data);
      setAutoCompleteValue(data.data);
    },
  });

  // NOTE : interest 추가하는 mutation
  const { mutate: postInterestMutate } = useMutation({
    mutationFn: ({ name }: Pick<interest, 'name'>) => postInterest({ name }),
    mutationKey: ['interests'],
    onError: (err) => console.error(err.message),
    onSuccess: () => setInputValue(''),
  });

  // NOTE : 테스트 버튼
  const onClickTest = async () => {
    console.log('clicked!');
    getInterestMutate();
  };

  // NOTE : interest 추가 input onChange function
  const onChangeInterestInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onSubmitInterestInput = (e: React.FormEvent) => {
    e.preventDefault();
    postInterestMutate({ name: inputValue });
  };

  // NOTE : 디바운스
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

  // NOTE : 디바운스 사용법
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
      <form
        className={clsx(
          {
            hidden: !addStart,
            block: addStart,
          },
          'bg-white relative w-[500px] p-6 flex flex-col gap-2'
        )}
        onSubmit={onSubmitInterestInput}
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
        <div className="flex items-center gap-2">
          <Input
            type="text"
            variant="subtle"
            ref={inputInterestRef}
            onChange={onChangeInterestInput}
          />
          <StyledButton type="submit">추가</StyledButton>
        </div>
      </form>
      <button onClick={clickDebounce}>관심사 불러오기 버튼</button>
      <ul>
        {autoCompleteValue.map((word) => (
          <li key={word._id}>{word.name}</li>
        ))}
      </ul>
    </>
  );
}
