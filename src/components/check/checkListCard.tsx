'use client';
import React, { useState } from 'react';

interface CheckListCardProps {
  task: string;
  isCompleted: boolean;
}

function CheckListCard({ task, isCompleted }: CheckListCardProps) {
  const [checked, setChecked] = useState(isCompleted);

  return (
    <div className="flex items-center">
      <div>{task}</div>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
      />
    </div>
  );
}

export default React.memo(CheckListCard);
