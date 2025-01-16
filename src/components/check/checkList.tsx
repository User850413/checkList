'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import { getChecks } from '@/app/services/api/checks';
import { deleteTag, patchTag, shareTag } from '@/app/services/api/tags';
import { Check } from '@/types/check';
import { Tag } from '@/types/tag';

import CheckInput from './checkInput';
import CheckListCard from './checkListCard';
import TagNameInput from './tagNameInput';
import FieldButton from '../common/fieldButton';
import ProgressBar from '../common/progressBar';
import { QueryKeys } from '@/app/lib/constants/queryKeys';
import {
  DialogActionTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from '../ui/dialog';
import { DialogCloseTrigger, DialogHeader } from '@chakra-ui/react';
import StyledButton from '../common/styledButton';

interface CheckListProp {
  tagName: string;
  tagId: string;
  interest: string;
}

function CheckList({ tagName, tagId, interest }: CheckListProp) {
  const [checkList, setCheckList] = useState<Check[]>([]);
  const [renderedRate, setRenderedRate] = useState(0);
  const [isShared, setIsShared] = useState<boolean>(false);

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

  // NOTE : 끝내기 뮤테이션
  const { mutate: completeMutate } = useMutation({
    mutationFn: () => patchTag({ _id: tagId, isCompleted: true }),
    onError: (err) => console.log(err.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.TAGS });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.MY_INTERESTS_UNCOMPLETED,
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.MY_INTERESTS_COMPLETED,
      });
    },
  });

  const onClickCompleteButton = () => {
    completeMutate();
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

  // NOTE : 공유하기 뮤테이션
  const { mutate: shareMutate } = useMutation({
    mutationFn: () => shareTag({ id: tagId }),
    onError: (err) => console.log(err.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.SHARED_TAGS });
    },
  });
  const onClickShareButton = () => {
    shareMutate();
    setIsShared(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <>
      <div className="h-full w-full rounded-lg bg-white px-3 py-2">
        <div className="border-b-2 border-b-slate-200">
          <div className="flex items-center justify-between">
            <TagNameInput tagName={tagName} tagId={tagId} />
            <DialogRoot placement={'center'}>
              <DialogTrigger>
                <span role="button" className="inline-block p-1 text-slate-400">
                  x
                </span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>정말로 삭제하시겠습니까?</DialogHeader>
                <DialogFooter>
                  <StyledButton
                    onClick={() => onClickDelete(tagId)}
                    color="red"
                    aria-label="삭제 확인"
                  >
                    삭제
                  </StyledButton>
                  <DialogActionTrigger>
                    <span className="rounded-md bg-slate-200 px-3 py-3">
                      취소
                    </span>
                  </DialogActionTrigger>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </div>
          <div className="flex w-full items-center gap-2 py-2">
            <FieldButton fieldName={interest} />
            <div className="flex w-full flex-col items-start justify-between gap-1">
              <div className="flex w-full items-center justify-between">
                <span className="my-2 cursor-default text-xs text-gray-500">
                  {renderedRate === 100 ? '완료!' : '진행도'}
                </span>
                {renderedRate === 100 && (
                  <DialogRoot placement={'center'}>
                    <DialogTrigger>
                      <span
                        className="rounded-md bg-slate-500 px-2 py-1 text-xs text-white hover:bg-slate-600"
                        role="button"
                      >
                        끝내기
                      </span>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>리스트를 끝내시겠습니까?</DialogHeader>
                      <DialogFooter>
                        <StyledButton
                          color="dark"
                          role="button"
                          size="md"
                          onClick={onClickCompleteButton}
                          aria-label="완료 확인"
                        >
                          확인
                        </StyledButton>
                        <DialogCloseTrigger>
                          <span className="rounded-md bg-slate-200 px-3 py-3 hover:bg-slate-300">
                            취소
                          </span>
                        </DialogCloseTrigger>
                      </DialogFooter>
                    </DialogContent>
                  </DialogRoot>
                )}

                {renderedRate < 100 && checkList.length > 0 && !isShared && (
                  <DialogRoot placement={'center'}>
                    <DialogTrigger>
                      <span
                        className="rounded-md bg-blue-400 px-2 py-1 text-xs text-white hover:bg-slate-600"
                        role="button"
                      >
                        올리기
                      </span>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>리스트를 공개하시겠습니까?</DialogHeader>
                      <DialogFooter>
                        <StyledButton
                          color="dark"
                          role="button"
                          size="md"
                          aria-label="완료 확인"
                          onClick={onClickShareButton}
                        >
                          확인
                        </StyledButton>
                        <DialogCloseTrigger>
                          <span className="rounded-md bg-slate-200 px-3 py-3 hover:bg-slate-300">
                            취소
                          </span>
                        </DialogCloseTrigger>
                      </DialogFooter>
                    </DialogContent>
                  </DialogRoot>
                )}
              </div>
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
    </>
  );
}

export default React.memo(CheckList);
