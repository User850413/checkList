'use client';

import { useAutoComplete } from './autoCompleteContext';
import { useEffect, useState } from 'react';

export default function AutoComplete() {
  const { suggestions, isBlur, setSelectedOption, selectedOption } =
    useAutoComplete();

  const [isOpen, setIsOpen] = useState<boolean>(!isBlur);
  const handleOptionClick = (e: React.MouseEvent, id: number | string) => {
    console.log('handleOptionClick clicked');
    e.stopPropagation();
    console.log(`selectedId :${id}`);
    const selectedName = suggestions.find((suggestion) => suggestion.id === id);
    console.log(selectedName);
    if (selectedName) {
      setSelectedOption(selectedName.option);
      console.log(`selected option : ${selectedOption}`);
    } else {
      throw new Error('존재하지 않는 항목입니다.');
    }
  };

  useEffect(() => {
    setIsOpen(!isBlur);
  }, [isBlur]);

  if (isOpen) {
    return (
      <>
        <ul className="relative bg-white shadow-card cursor-default z-10 auto-complete">
          {suggestions.map((suggestion) => (
            <li
              className="cursor-pointer hover:bg-slate-300 auto-complete"
              key={suggestion.id}
              role="button"
              tabIndex={0}
              onClick={(e) => handleOptionClick(e, suggestion.id)}
            >
              {suggestion.option}
            </li>
          ))}
        </ul>
      </>
    );
  }
}
