import { Input } from '@chakra-ui/react';
import { InputHTMLAttributes, useEffect, useRef } from 'react';

import { useAutoComplete } from './autoCompleteContext';

type CustomInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '2xs' | 'xs';
  handleChangedValue?: (selection: string) => void;
};

function InputWithAutoComplete({
  handleChangedValue,
  ...rest
}: CustomInputProps) {
  const { selectedOption, setIsBlur } = useAutoComplete();
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = selectedOption;
      if (handleChangedValue) handleChangedValue(inputRef.current.value);
    }
  }, [selectedOption, handleChangedValue]);

  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('.auto-complete')) {
      e.preventDefault();
      return;
    }
    setIsBlur(true);
  };

  return (
    <Input
      type="text"
      ref={inputRef}
      onFocus={() => setIsBlur(false)}
      onBlur={handleBlur}
      {...rest}
      id="inputWithAutoComplete"
      className="flex w-full items-center rounded-lg bg-slate-100 px-1"
    />
  );
}

export default InputWithAutoComplete;
