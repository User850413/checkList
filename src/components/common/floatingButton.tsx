'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

interface FloatingButtonProps extends PropsWithChildren {
  background?: string;
  onClickFn?: () => void;
  classNames?: string;
}

export default function FloatingButton({
  background = '#6395ff',
  onClickFn = () => {},
  children,
  classNames,
}: FloatingButtonProps) {
  return (
    <motion.span
      role="button"
      tabIndex={0}
      className={clsx(
        'fixed bottom-5 right-8 z-10 flex aspect-square min-h-12 min-w-12 items-center justify-center rounded-full',
        classNames,
      )}
      style={{ background }}
      initial={{ opacity: 0.5 }}
      whileHover={{ opacity: 1 }}
      onClick={onClickFn}
    >
      {children}
    </motion.span>
  );
}
