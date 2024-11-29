import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import React from 'react';
import { Button } from '@/components/ui/button';

interface StyledButtonProps extends ChakraButtonProps {
  loading?: boolean;
  loadingText?: React.ReactNode;
}

const StyledButton = React.forwardRef<HTMLButtonElement, StyledButtonProps>(
  function StyledButton(props, ref) {
    const { children } = props;
    return (
      <Button {...props} ref={ref}>
        {children}
      </Button>
    );
  }
);

export default StyledButton;
