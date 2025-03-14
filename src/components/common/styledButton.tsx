import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

import clsx from 'clsx';
import React from 'react';

import { Button } from '@/components/ui/button';

interface StyledButtonProps extends ChakraButtonProps {
  loading?: boolean;
  loadingText?: React.ReactNode;
  color?: 'default' | 'red' | 'dark';
}

const StyledButton = React.forwardRef<HTMLButtonElement, StyledButtonProps>(
  function StyledButton(props, ref) {
    let { children, disabled, className, color, size } = props;
    if (size == undefined) size = 'md';

    return (
      <Button
        {...props}
        ref={ref}
        className={clsx(
          `${className}`,
          {
            'bg-slate-200 hover:bg-slate-300': !color || color == 'default',
            'bg-red-200 text-white hover:bg-red-300':
              color == 'red' && !disabled,
            'bg-slate-500 text-white hover:bg-slate-600': color === 'dark',
          },
          {
            'px-2 py-1 text-xs': size === 'xs' || size === '2xs',
            'px-2 py-1 text-sm': size === 'sm',
            'px-3 py-1': size === 'md',
            'px-5 py-2 text-lg': size === 'lg',
            'px-5 py-2 text-xl': size === 'xl',
            'px-5 py-2 text-2xl': size === '2xl',
          },
        )}
      >
        {children}
      </Button>
    );
  },
);

export default StyledButton;
