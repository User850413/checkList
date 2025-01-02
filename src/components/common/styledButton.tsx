import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

interface StyledButtonProps extends ChakraButtonProps {
  loading?: boolean;
  loadingText?: React.ReactNode;
  color?: 'default' | 'red' | 'dark';
}

const StyledButton = React.forwardRef<HTMLButtonElement, StyledButtonProps>(
  function StyledButton(props, ref) {
    const { children, disabled, className, color } = props;

    return (
      <Button
        {...props}
        ref={ref}
        className={clsx(
          `${className}`,
          {
            'bg-slate-200 hover:bg-slate-300': !color || color == 'default',
            'bg-red-200 hover:bg-red-300 text-white':
              color == 'red' && !disabled,
            'bg-slate-500 hover:bg-slate-600 text-white': color === 'dark',
          },
          'py-2 px-5'
        )}
      >
        {children}
      </Button>
    );
  }
);

export default StyledButton;
