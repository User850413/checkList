'use client';
import React, { useState } from 'react';

interface CheckListCardProps {
  task: string;
  isCompleted: boolean;
}

function CheckListCard({ task, isCompleted }: CheckListCardProps) {
  const [checked, setChecked] = useState(isCompleted);

  const onClickCard = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div className="flex items-center text-sm gap-2">
      <input type="checkbox" checked={checked} onChange={onClickCard} />
      <div className="cursor-pointer" onClick={onClickCard}>
        {task}
      </div>
    </div>
  );
}

export default React.memo(CheckListCard);
