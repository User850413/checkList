import { useMutation, useQueryClient } from '@tanstack/react-query';
import StyledButton from '../common/styledButton';
import { takeSharedTag } from '@/app/services/api/tags';
import { QueryKeys } from '@/app/lib/constants/queryKeys';
import FieldButton from '../common/fieldButton';

interface SharedTagCardProps {
  id: string;
  name: string;
  interest: string;
  list: string[];
}

export default function SharedTagCard({
  id,
  name,
  list,
  interest,
}: SharedTagCardProps) {
  const queryClient = useQueryClient();

  // NOTE : take 뮤테이션
  const { mutate: takeMutate } = useMutation({
    mutationFn: () => takeSharedTag({ id }),
    mutationKey: QueryKeys.MY_TAGS_UNCOMPLETED,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.MY_TAGS_UNCOMPLETED,
      }),
        queryClient.invalidateQueries({ queryKey: QueryKeys.SHARED_TAGS });
    },
  });

  const onClickTakeButton = () => {
    takeMutate();
  };

  return (
    <>
      <div className="flex h-full flex-col justify-between rounded-lg bg-white px-5 py-4 shadow-card">
        <div>
          <div className="flex w-full cursor-default justify-between border-b-2 border-slate-100 pb-2 text-lg">
            <span>{name}</span>
            <FieldButton fieldName={interest} />
          </div>
          <ul className="flex cursor-default flex-col items-start gap-2 pt-4 text-sm">
            {list.map((li, i) => (
              <li className="flex items-center gap-2" key={i}>
                <span className="h-3 w-3 flex-shrink-0 rounded-full bg-slate-200" />
                <span>{li}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-2 flex w-full justify-center">
          <StyledButton size={'sm'} onClick={onClickTakeButton} color="dark">
            가져오기
          </StyledButton>
        </div>
      </div>
    </>
  );
}
