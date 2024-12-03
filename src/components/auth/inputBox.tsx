import { Input, InputProps } from '@chakra-ui/react';
import { Field } from '../ui/field';
import React, { ChangeEvent } from 'react';
import clsx from 'clsx';

const labels = {
  email: {
    type: 'email',
    en: 'email',
    ko: '이메일',
    ariaLabel: '이메일 입력',
  },
  password: {
    type: 'password',
    en: 'password',
    ko: '비밀번호',
    ariaLabel: '비밀번호 입력',
  },
  passwordCheck: {
    type: 'password',
    en: 'password check',
    ko: '비밀번호 확인',
    ariaLabel: '비밀번호 확인 입력',
  },
  username: {
    type: 'text',
    en: 'username',
    ko: '닉네임',
    ariaLabel: '닉네임 입력',
  },
} as const;

interface InputBoxProps extends InputProps {
  setKeyValue: (name: string) => void;
  fieldType: keyof typeof labels;
  label?: string;
  helperText?: string;
  isError?: boolean;
  errorText?: string;
  inputValue?: string;
}

const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  function InputBox(props, ref) {
    const {
      setKeyValue,
      fieldType,
      helperText,
      errorText,
      isError,
      inputValue,
      maxLength,
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
          label={labels[fieldType].ko}
          required={rest.required}
          helperText={helperText}
          errorText={isError && errorText}
        >
          <Input
            type={labels[fieldType].type}
            {...rest}
            ref={ref}
            onChange={(e) => handleInputChange(e)}
            className={clsx('border-2 rounded-lg', {
              'border-slate-100': !isError,
              'border-red-300': isError,
            })}
            value={inputValue}
            aria-label={labels[fieldType].ariaLabel}
          />
        </Field>
      </>
    );
  }
);

export default React.memo(InputBox);
