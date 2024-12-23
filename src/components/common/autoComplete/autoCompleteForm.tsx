import React from 'react';

interface AutoCompleteFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent) => void;
}

export default function AutoCompleteForm({
  children,
  onSubmit,
  ...props
}: AutoCompleteFormProps) {
  return (
    <form onSubmit={onSubmit} {...props}>
      {children}
    </form>
  );
}
