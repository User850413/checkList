import { useState } from 'react';

interface AddNewTagDetailProps {
  trigger: boolean;
  onTriggered: () => void;
}

export default function AddNewTagDetail({
  trigger,
  onTriggered,
}: AddNewTagDetailProps) {
  const [tagInterest, setTagInterest] = useState<boolean>('기타');

  return <div>AddNewTagDetail</div>;
}
