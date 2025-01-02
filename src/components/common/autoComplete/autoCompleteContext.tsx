'use client';

import { createContext, PropsWithChildren, useContext, useState } from 'react';

export interface OptionsType {
  option: string;
  id: number | string;
}

// NOTE : context가 관리하는 값
interface AutoCompleteContextProps {
  suggestions: OptionsType[];
  isBlur: boolean;
  setIsBlur: (value: boolean) => void;
  selectedOption: string;
  setSelectedOption: (value: string) => void;
}

// NOTE : Provider가 상위에서 받아야 하는 값
interface AutoCompleteProviderProps {
  suggestions: OptionsType[];
}

const AutoCompleteContext = createContext<AutoCompleteContextProps | undefined>(
  undefined,
);

export const AutoCompleteProvider: React.FC<
  PropsWithChildren<AutoCompleteProviderProps>
> = ({ suggestions, children }) => {
  const [isBlur, setIsBlur] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <AutoCompleteContext.Provider
      value={{
        suggestions,
        isBlur,
        selectedOption,
        setSelectedOption,
        setIsBlur,
      }}
    >
      {children}
    </AutoCompleteContext.Provider>
  );
};

export const useAutoComplete = () => {
  const context = useContext(AutoCompleteContext);
  if (!context) {
    throw new Error(
      'useAutoComplete는 AutoCompleteProvider 아래에서 작동합니다',
    );
  }

  return context;
};
