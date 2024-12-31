'use client';
import { getWordInterest } from '@/app/services/api/interests';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import StyledButton from '../common/styledButton';
import { interestResponse } from '@/types/interest';
import {
  AutoCompleteProvider,
  OptionsType,
} from '../common/autoComplete/autoCompleteContext';
import InputWithAutoComplete from '../common/autoComplete/inputWithAutoComplete';
import AutoComplete from '../common/autoComplete/autoComplete';
import debounce from '@/app/utils/debounce';
import AutoCompleteForm from '../common/autoComplete/autoCompleteForm';

export default function AddNewInterest() {
  const [addStart, setAddStart] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const [autoCompleteValue, setAutoCompleteValue] = useState<OptionsType[]>([]);

  const plusButton = `${process.env.PUBLIC_URL || ''}/icons/plus-round.svg`;
  const closeButton = `${process.env.PUBLIC_URL || ''}/icons/x-round.svg`;

  // NOTE : interest 불러오는 mutation
  const { mutate: getInterestMutate } = useMutation({
    mutationFn: () => getWordInterest({ word: inputValue }),
    mutationKey: ['interests'],
    onError: (err) => console.error(err.message),
    onSuccess: (data: interestResponse) => {
      if (!data) return;
      //NOTE :interest[] -> OptionsType[] 변환
      const mappedData = data.data.map(({ _id, name }) => ({
        id: _id,
        option: name,
      }));

      setAutoCompleteValue(mappedData);
    },
  });

  // NOTE : interest 추가하는 mutation
  // const { mutate: postInterestMutate } = useMutation({
  //   mutationFn: ({ name }: Pick<interest, 'name'>) => postInterest({ name }),
  //   mutationKey: ['interests'],
  //   onError: (err) => console.error(err.message),
  //   onSuccess: () => setInputValue(''),
  // });

  // NOTE : form 제출
  const submitInterest = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    console.log(formData.get('inputValue'));
  };

  // NOTE : interest 추가 input onChange function
  const onChangeInterestInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debounce(getInterestMutate)();
  };

  return (
    <>
      <button
        className={clsx('relative w-14 h-14 rounded-full', {
          hidden: addStart,
          block: !addStart,
        })}
        type="button"
        onClick={() => setAddStart(true)}
      >
        <Image fill objectFit="cover" src={plusButton} alt="관심사 추가" />
      </button>
      <div
        className={clsx(
          'w-[500px] bg-white py-6 px-4 rounded-lg shadow-card flex flex-col items-start gap-2',
          {
            hidden: !addStart,
            block: addStart,
          }
        )}
      >
        <div className="flex justify-between items-center w-full">
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
        <AutoCompleteProvider suggestions={autoCompleteValue}>
          <AutoCompleteForm
            onSubmit={submitInterest}
            className="relative gap-2 w-full flex"
          >
            <InputWithAutoComplete
              className="bg-slate-100 p-1"
              onChange={onChangeInterestInput}
              name="inputValue"
            />
            <AutoComplete />
            <StyledButton type="submit">추가</StyledButton>
          </AutoCompleteForm>
        </AutoCompleteProvider>
      </div>
    </>
  );
}
