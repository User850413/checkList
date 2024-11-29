import { Input, InputProps } from '@chakra-ui/react';
import { Field } from '../ui/field';

interface InputBoxProps extends InputProps {
  label?: string;
  helperText?: string;
}

export default function InputBox(props: InputBoxProps) {
  const { helperText, label } = props;

  return (
    <>
      <Field label={label} required helperText={helperText}>
        <Input {...props} className="border-slate-100 border-2 rounded-lg" />
      </Field>
    </>
  );
}
