import { Input, InputProps } from '@chakra-ui/react';
import clsx from 'clsx';
import React, { ChangeEvent } from 'react';

import { Field } from '../ui/field';


export interface LabelProps {
  type: string;
  en: string;
  ko: string;
  ariaLabel: string;
}

interface InputBoxProps extends InputProps {
  setKeyValue: (name: string) => void;
  label: LabelProps;
  helperText?: string;
  isError?: boolean;
  errorText?: string;
  inputValue?: string;
}

const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  function InputBox(props, ref) {
    const {
      setKeyValue,
      helperText,
      errorText,
      isError,
      inputValue,
      maxLength,
      label,
      ...rest
    } = props;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (maxLength) {
        setKeyValue(e.currentTarget.value.slice(0, maxLength));
      } else {
        setKeyValue(e.currentTarget.value);
      }
    };

    return (
      <>
        <Field
          invalid={isError}
          label={label.ko}
          required={rest.required}
          helperText={helperText}
          errorText={isError && errorText}
        >
          <Input
            type={label.type}
            {...rest}
            ref={ref}
            onChange={(e) => handleInputChange(e)}
            className={clsx('border-2 rounded-lg', {
              'border-slate-100': !isError,
              'border-red-300': isError,
            })}
            value={inputValue}
            aria-label={label.ariaLabel}
          />
        </Field>
      </>
    );
  }
);

export default React.memo(InputBox);
