'use client';

import { useEffect, useState } from 'react';

import { useAutoComplete } from './autoCompleteContext';

export default function AutoComplete(
  props: React.HTMLAttributes<HTMLUListElement>
) {
  const { suggestions, isBlur, setSelectedOption } = useAutoComplete();

  const [isOpen, setIsOpen] = useState<boolean>(!isBlur);

  const handleOptionClick = (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    const selectedName = suggestions.find((suggestion) => suggestion.id === id);
    if (selectedName) {
      setSelectedOption(selectedName.option);
      setIsOpen(false);
    } else {
      throw new Error('존재하지 않는 항목입니다.');
    }
  };

  useEffect(() => {
    setIsOpen(!isBlur);
  }, [isBlur]);

  if (isOpen && suggestions.length > 0) {
    return (
      <ul
        {...props}
        className="bg-white shadow-card cursor-default z-10 auto-complete p-2 rounded-md absolute top-full"
      >
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
    );
  }
}
