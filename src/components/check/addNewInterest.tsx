'use client';
import { getWordInterest } from '@/app/services/api/interests';
import { useMutation } from '@tanstack/react-query';
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

interface AddNewInterestProps {
  onEntered?: () => void;
}

export default function AddNewInterest({ onEntered }: AddNewInterestProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const [autoCompleteValue, setAutoCompleteValue] = useState<OptionsType[]>([]);

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

  // NOTE : form 제출
  // const submitInterest = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const form = e.currentTarget as HTMLFormElement;
  //   const formData = new FormData(form);

  //   console.log(formData.get('inputValue'));
  // };

  // NOTE : interest 추가 input onChange function
  const onChangeInterestInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debounce(getInterestMutate)();
  };

  return (
    <>
      <div className="w-full flex gap-2">
        <AutoCompleteProvider suggestions={autoCompleteValue}>
          <InputWithAutoComplete
            className="bg-slate-100 p-1"
            onChange={onChangeInterestInput}
            name="inputValue"
          />
          <AutoComplete />
          <StyledButton type="submit">추가</StyledButton>
        </AutoCompleteProvider>
      </div>
    </>
  );
}
