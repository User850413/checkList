import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import AddNewInterest from './addNewInterest';
import { Field } from '../ui/field';
import StyledButton from '../common/styledButton';
import { TagRequest } from '@/types/tag';

interface AddNewTagDetailProps {
  onChange: Dispatch<SetStateAction<TagRequest>>;
  trigger: boolean; // NOTE : 상위 컴포넌트 상태 변경 시 reset trigger
  setTrigger: Dispatch<SetStateAction<boolean>>;
}

export default function AddNewTagDetail({
  onChange,
  trigger,
  setTrigger,
}: AddNewTagDetailProps) {
  const [tagInterest, setTagInterest] = useState<string>('');
  const [isWriting, setIsWriting] = useState<boolean>(true);

  const handleSubmitted = (value: string) => {
    if (!value) return;

    setTagInterest(value);
    onChange((prev) => ({ ...prev, interest: value }));
    setIsWriting(false);
  };

  useEffect(() => {
    if (trigger) {
      setTagInterest('');
      setIsWriting(true);
      setTrigger(false);
    }
  }, [trigger]);

  return (
    <>
      <Field label="관련 관심사" orientation={'horizontal'}>
        {isWriting && (
          <AddNewInterest
            onSubmit={handleSubmitted}
            buttonText="확인"
            defaultText={tagInterest}
          />
        )}
        {!isWriting && (
          <div className="flex w-full items-center gap-2">
            <span className="cursor-default text-sm">{tagInterest}</span>
            <StyledButton
              className="px-2 py-2 text-xs"
              size="xs"
              onClick={() => setIsWriting(true)}
            >
              수정
            </StyledButton>
          </div>
        )}
      </Field>
    </>
  );
}
