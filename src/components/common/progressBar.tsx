'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  full?: number;
  completed: number;
}

export default function ProgressBar({
  full = 100,
  completed,
}: ProgressBarProps) {
  const rate = full > 0 ? Math.floor((completed / full) * 100) : 0;
  const [rateBar, setRateBar] = useState<number>(rate);
  useEffect(() => {
    setRateBar(rate);
  }, [rate]);

  return (
    <div className="relative h-2 w-full rounded-full bg-slate-200">
      <motion.span
        initial={{ width: 0 }}
        animate={{ width: `${rateBar}%` }}
        className="absolute bottom-0 left-0 top-0 rounded-full bg-blue-300"
      />
    </div>
  );
}
