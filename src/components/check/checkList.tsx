'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import { getChecks } from '@/app/services/api/checks';
import { deleteTag } from '@/app/services/api/tags';
import { Check } from '@/types/check';
import { Tag } from '@/types/tag';

import CheckInput from './checkInput';
import CheckListCard from './checkListCard';
import TagNameInput from './tagNameInput';
import FieldButton from '../common/fieldButton';
import ProgressBar from '../common/progressBar';
import { QueryKeys } from '@/app/lib/constants/queryKeys';

interface CheckListProp {
  tagName: string;
  tagId: string;
  interest: string;
}

function CheckList({ tagName, tagId, interest }: CheckListProp) {
  const [checkList, setCheckList] = useState<Check[]>([]);
  const [renderedRate, setRenderedRate] = useState(0);

  const queryClient = useQueryClient();

  // NOTE : checks 불러오는 쿼리
  const {
    isLoading,
    data: list,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['checks', tagId],
    queryFn: () => getChecks({ tagId }),
  });

  useEffect(() => {
    if (isSuccess) {
      setCheckList(list.data);
    }
  }, [list, isSuccess]);

  // NOTE : 삭제 뮤테이션
  const { mutate: deleteMutate } = useMutation({
    mutationFn: ({ _id }: Pick<Tag, '_id'>) => deleteTag({ _id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.TAGS });
      queryClient.invalidateQueries({ queryKey: QueryKeys.MY_INTERESTS });
    },
    onError: (err) => {
      console.log(`항목 삭제 실패: ${err}`);
    },
  });

  const onClickDelete = (_id: string) => {
    deleteMutate({ _id });
  };

  // NOTE : complete 클릭 시 새로 tag api 요청 대신 render만 다시
  useEffect(() => {
    if (checkList.length > 0) {
      const totalChecks = checkList.length;
      const completedChecks = checkList.filter(
        (check) => check.isCompleted,
      ).length;

      setRenderedRate(Math.floor((completedChecks / totalChecks) * 100));
    }
  }, [checkList]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="h-full w-full rounded-lg bg-white px-3 py-2">
      <div className="border-b-2 border-b-slate-200">
        <div className="flex items-center justify-between">
          <TagNameInput tagName={tagName} tagId={tagId} />
          <button
            onClick={() => onClickDelete(tagId)}
            className="inline-block p-1 text-slate-400"
          >
            x
          </button>
        </div>
        <div className="flex w-full items-center gap-2 py-2">
          <FieldButton fieldName={interest} />
          <div className="flex w-full flex-col items-start justify-between gap-2">
            <span className="cursor-default text-xs text-gray-500">
              {renderedRate === 100 ? '완료!' : '진행도'}
            </span>
            <ProgressBar completed={renderedRate} />
          </div>
        </div>
      </div>
      <ul className="my-3 flex flex-col gap-2">
        {checkList?.map((check, index) => (
          <li key={check._id || index}>
            <CheckListCard
              id={check._id}
              task={check.task}
              isCompleted={check.isCompleted}
              tagId={check.tagId}
            />
          </li>
        ))}
      </ul>
      {checkList.length === 0 && (
        <span className="mb-5 flex min-h-10 w-full cursor-default items-center justify-center text-sm text-slate-600">
          아직 작성된 리스트가 없습니다. 항목을 추가해보세요!
        </span>
      )}
      <div>
        <CheckInput tagId={tagId} />
      </div>
    </div>
  );
}

export default React.memo(CheckList);
