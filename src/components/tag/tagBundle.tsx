'use client';

import { getMyTags } from '@/app/services/api/tags';
import { Tag } from '@/types/tag';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import CheckListWrapper from '../check/checkListWrapper';
import { getMyInterest } from '@/app/services/api/interests';
import { interest } from '@/types/interest';
import FieldButton from '../common/fieldButton';
import { QueryKeys } from '@/app/lib/constants/queryKeys';

export default function TagBundle() {
  const queryClient = useQueryClient();

  const [tagList, setTagList] = useState<Tag[]>([]);
  const [interestList, setInterestList] = useState<interest[]>([]);
  const [interestFilter, setInterestFilter] = useState<string>('');

  // NOTE : interest 불러오는 쿼리
  const {
    isLoading: isInterestsLoading,
    data: interests,
    error: interestsError,
    isSuccess: isInterestsSuccess,
  } = useQuery({
    queryKey: QueryKeys.MY_INTERESTS,
    queryFn: () => getMyInterest({ isCompleted: 'false' }),
  });

  useEffect(() => {
    if (isInterestsSuccess) setInterestList(interests.data);
  }, [interests, isInterestsSuccess]);

  // NOTE : tag 불러오는 쿼리
  const {
    refetch: tagRefetch,
    isLoading: isTagsLoading,
    data: tags,
    error: tagsError,
    isSuccess: isTagsSuccess,
  } = useQuery({
    queryKey: QueryKeys.MY_TAGS,
    queryFn: () => {
      if (interestFilter) {
        return getMyTags({ interest: interestFilter, isCompleted: 'false' });
      }
      return getMyTags({ isCompleted: 'false' });
    },
  });

  useEffect(() => {
    if (isTagsSuccess) setTagList(tags?.data);
  }, [tags, isTagsSuccess]);

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
    tagRefetch();
    console.log(interestFilter);
  }, [interestFilter]);

  return (
    <div className="w-full px-6 py-10">
      <ul className="mb-5 flex flex-wrap gap-2 rounded-md bg-slate-300 p-2">
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
      <CheckListWrapper
        isLoading={isTagsLoading || isInterestsLoading}
        tags={tagList}
        error={tagsError || interestsError}
      />
    </div>
  );
}
