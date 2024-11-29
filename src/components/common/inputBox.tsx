import { Input, InputProps } from '@chakra-ui/react';
import { Field } from '../ui/field';
import React from 'react';

interface InputBoxProps extends InputProps {
  label?: string;
  helperText?: string;
}

const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  function InputBox(props, ref) {
    const { helperText, label, ...rest } = props;

    return (
      <>
        <Field label={label} required={rest.required} helperText={helperText}>
          <Input
            {...rest}
            ref={ref}
            className="border-slate-100 border-2 rounded-lg"
          />
        </Field>
      </>
    );
  }
);

export default React.memo(InputBox);
