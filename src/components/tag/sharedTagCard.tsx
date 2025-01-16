import { useMutation } from '@tanstack/react-query';
import StyledButton from '../common/styledButton';
import { takeSharedTag } from '@/app/services/api/tags';
import { QueryKeys } from '@/app/lib/constants/queryKeys';

interface SharedTagCardProps {
  id: string;
  name: string;
  list: string[];
}

export default function SharedTagCard({ id, name, list }: SharedTagCardProps) {
  // NOTE : take 뮤테이션
  const { mutate: takeMutate } = useMutation({
    mutationFn: () => takeSharedTag({ id }),
    mutationKey: QueryKeys.MY_TAGS_UNCOMPLETED,
  });

  const onClickTakeButton = () => {
    takeMutate();
  };

  return (
    <>
      <div className="rounded-lg bg-white px-5 py-4 shadow-card">
        <div className="w-full cursor-default border-b-2 border-slate-100 pb-2 text-lg">
          {name}
        </div>
        <ul className="flex cursor-default flex-col items-start gap-2 pt-4 text-sm">
          {list.map((li, i) => (
            <li className="flex items-center gap-2" key={i}>
              <span className="h-3 w-3 rounded-full bg-slate-200" />
              <span>{li}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex w-full justify-center">
          <StyledButton size={'sm'} onClick={onClickTakeButton}>
            가져오기
          </StyledButton>
        </div>
      </div>
    </>
  );
}
