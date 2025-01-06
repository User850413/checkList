'use client';

import { useEffect, useState } from 'react';

interface ProgressBar {
  full: number;
  completed: number;
}

export default function ProgressBar({ full, completed }: ProgressBar) {
  const rate = Math.floor((completed / full) * 100);
  const [rateBar, setRateBar] = useState<number>(rate);
  useEffect(() => {
    setRateBar(rate);
    // console.log(`rate: ${rate}`);
  }, [rate]);

  return (
    <div className="relative h-2 w-full rounded-full bg-slate-200">
      <span
        style={{ width: `${rateBar}%` }}
        className="absolute bottom-0 left-0 top-0 rounded-full bg-blue-300"
      />
    </div>
  );
}
