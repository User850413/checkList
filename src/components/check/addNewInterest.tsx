'use client';
import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';

import { getWordInterest } from '@/app/services/api/interests';
import debounce from '@/app/utils/debounce';
import { interestResponse } from '@/types/interest';

import AutoComplete from '../common/autoComplete/autoComplete';
import {
  AutoCompleteProvider,
  OptionsType,
} from '../common/autoComplete/autoCompleteContext';
import InputWithAutoComplete from '../common/autoComplete/inputWithAutoComplete';
import StyledButton from '../common/styledButton';
import { QueryKeys } from '@/app/lib/constants/queryKeys';

interface AddNewInterestProps {
  onSubmit: (value: string) => void;
  isButtoned?: boolean;
  buttonText?: string;
  defaultText?: string;
}

export default function AddNewInterest({
  onSubmit,
  isButtoned = true,
  buttonText = '추가',
  defaultText = '',
}: AddNewInterestProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const [autoCompleteValue, setAutoCompleteValue] = useState<OptionsType[]>([]);

  // NOTE : interest 불러오는 mutation
  const { mutate: getInterestMutate } = useMutation({
    mutationFn: () => getWordInterest({ word: inputValue }),
    mutationKey: QueryKeys.INTERESTS,
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

  const submitFunc = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;
    onSubmit(trimmedValue);
  };

  // NOTE : enter 누를 시 onSubmit function 시행
  const handleEnterInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!inputValue) return;
      submitFunc();
    }
  };

  // NOTE : interest 추가 input onChange function
  const onChangeInterestInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debounce(getInterestMutate)();
  };

  return (
    <>
      <div className="flex w-full gap-2">
        <AutoCompleteProvider suggestions={autoCompleteValue}>
          <div className="relative w-full">
            <InputWithAutoComplete
              className="bg-slate-100 p-1"
              onChange={onChangeInterestInput}
              name="inputValue"
              onKeyDown={handleEnterInput}
              handleChangedValue={setInputValue}
              defaultText={defaultText}
            />
            <AutoComplete />
          </div>

          {isButtoned && (
            <StyledButton type="button" onClick={submitFunc} size="md">
              {buttonText}
            </StyledButton>
          )}
        </AutoCompleteProvider>
      </div>
    </>
  );
}
