import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

interface StyledButtonProps extends ChakraButtonProps {
  loading?: boolean;
  loadingText?: React.ReactNode;
}

const StyledButton = React.forwardRef<HTMLButtonElement, StyledButtonProps>(
  function StyledButton(props, ref) {
    const { children, disabled, className } = props;
    return (
      <Button
        {...props}
        ref={ref}
        className={clsx(
          `${className}`,
          {
            'hover:bg-slate-300': !disabled,
          },
          'bg-slate-200 py-2 px-5'
        )}
      >
        {children}
      </Button>
    );
  }
);

export default StyledButton;
