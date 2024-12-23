import { InputHTMLAttributes, useEffect, useRef } from 'react';
import { useAutoComplete } from './autoCompleteContext';
import { Input } from '@chakra-ui/react';

type CustomInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '2xs' | 'xs';
};

function InputWithAutoComplete(props: CustomInputProps) {
  const { selectedOption, setIsBlur } = useAutoComplete();
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = selectedOption;
  }, [selectedOption]);

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
      {...props}
      id="inputWithAutoComplete"
    />
  );
}

export default InputWithAutoComplete;
