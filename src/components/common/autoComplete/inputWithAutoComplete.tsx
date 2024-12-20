import { useEffect, useRef, useState } from 'react';
import { useAutoComplete } from './autoCompleteContext';

export default function InputWithAutoComplete(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const [inputValue, setInputValue] = useState('');
  const { selectedOption, setIsBlur } = useAutoComplete();
  const inputRef = useRef<null | HTMLInputElement>(null);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    setInputValue(selectedOption);
  }, [selectedOption]);

  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.closest('.auto-complete')) {
      e.preventDefault();
      return;
    }
    setIsBlur(true);
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={onChangeInput}
      ref={inputRef}
      onFocus={() => setIsBlur(false)}
      onBlur={handleBlur}
      {...props}
    />
  );
}
