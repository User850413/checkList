import { Input } from '@chakra-ui/react';
import { Field } from '../ui/field';

interface InputBoxProps {
  label?: string;
  placeholder?: string;
  size?: '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
  helperText?: string;
  required?: boolean;
}

export default function InputBox({
  label,
  placeholder,
  size,
  helperText,
  required = false,
}: InputBoxProps) {
  return (
    <>
      <Field label={label} required helperText={helperText}>
        <Input
          size={size}
          placeholder={placeholder}
          className="border-slate-100 border-2 rounded-lg"
          type="email"
          required={required}
        />
      </Field>
    </>
  );
}
