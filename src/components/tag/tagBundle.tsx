'use client';

import { getMyTags } from '@/app/services/api/tags';
import { Tag } from '@/types/tag';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import CheckListWrapper from '../check/checkListWrapper';
import { getMyInterest } from '@/app/services/api/interests';
import { interest } from '@/types/interest';
import FieldButton from '../common/fieldButton';
import { QueryKeys } from '@/app/lib/constants/queryKeys';
import { useInView } from 'react-intersection-observer';

export default function TagBundle() {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [interestList, setInterestList] = useState<interest[]>([]);
  const [interestFilter, setInterestFilter] = useState<string>('');

  // NOTE : 무한스크롤 관련
  const [ref, inView] = useInView();

  // NOTE : interest 불러오는 쿼리
  const {
    isLoading: isInterestsLoading,
    data: interests,
    error: interestsError,
    isSuccess: isInterestsSuccess,
  } = useQuery({
    queryKey: QueryKeys.MY_INTERESTS_UNCOMPLETED,
    queryFn: () => getMyInterest({ isCompleted: 'false' }),
  });

  useEffect(() => {
    if (isInterestsSuccess) setInterestList(interests.data);
  }, [interests, isInterestsSuccess]);

  // NOTE : tag 불러오는 쿼리
  const {
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
    data,
    error,
    isSuccess: isTagsSuccess,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: QueryKeys.MY_TAGS_UNCOMPLETED,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      if (interestFilter) {
        return getMyTags({
          interest: interestFilter,
          isCompleted: 'false',
          page: pageParam,
        });
      }
      return getMyTags({ isCompleted: 'false', page: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, total, limit } = lastPage;
      return page * limit < total ? page + 1 : null;
    },
  });

  useEffect(() => {
    if (data) {
      const allTags = data.pages.flatMap((page) => page.data);
      setTagList(allTags);
    }
  }, [data]);

  const onClickInterestButton = (name: string) => {
    setInterestFilter((prev) => {
      if (prev === name) {
        return '';
      } else {
        return name;
      }
    });
  };

  // NOTE : interestFilter 변경 때마다 tag refetch
  useEffect(() => {
    refetch();
  }, [interestFilter]);

  // NOTE : view 감지
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  return (
    <div className="mb-10 w-full px-6">
      {interestList && interestList.length > 0 && (
        <ul className="mb-5 flex flex-wrap gap-2 rounded-md bg-blue-200 p-2">
          {interestList.map((interest) => (
            <li key={interest._id}>
              <FieldButton
                fieldName={interest.name}
                clickable
                isClicked={interest.name === interestFilter}
                onClickFn={() => onClickInterestButton(interest.name)}
              />
            </li>
          ))}
        </ul>
      )}
      <CheckListWrapper
        isLoading={isLoading || isInterestsLoading}
        tags={tagList}
        error={error || interestsError}
      />
      {tagList.length > 0 && hasNextPage && (
        <div
          className="absolute -bottom-24 flex h-24 w-full items-center justify-center"
          ref={ref}
        />
      )}
    </div>
  );
}
