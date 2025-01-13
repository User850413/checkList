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
  background = '#2563eb',
  onClickFn = () => {},
  children,
  classNames,
}: FloatingButtonProps) {
  return (
    <motion.button
      className={clsx(
        'fixed bottom-5 right-5 z-10 aspect-square min-h-12 min-w-12 rounded-full p-2',
        classNames,
      )}
      style={{ background }}
      initial={{ opacity: 0.5 }}
      whileHover={{ opacity: 1 }}
      onClick={onClickFn}
    >
      {children}
    </motion.button>
  );
}
