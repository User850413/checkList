'use client';

import { getMyTags } from '@/app/services/api/tags';
import { Tag } from '@/types/tag';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import CheckListWrapper from '../check/checkListWrapper';
import { getMyInterest } from '@/app/services/api/interests';
import { interest } from '@/types/interest';
import FieldButton from '../common/fieldButton';

export default function TagBundle() {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [interestList, setInterestList] = useState<interest[]>([]);

  // NOTE : interest 불러오는 쿼리
  const {
    isLoading: isInterestsLoading,
    data: interests,
    error: interestsError,
    isSuccess: isInterestsSuccess,
  } = useQuery({
    queryKey: ['interests', 'mine'],
    queryFn: () => getMyInterest(),
  });

  useEffect(() => {
    if (isInterestsSuccess) setInterestList(interests.data);
  }, [interests, isInterestsSuccess]);

  // NOTE : tag 불러오는 쿼리
  const {
    isLoading: isTagsLoading,
    data: tags,
    error: tagsError,
    isSuccess: isTagsSuccess,
  } = useQuery({
    queryKey: ['tags', 'mine'],
    queryFn: () => getMyTags(),
  });

  useEffect(() => {
    if (isTagsSuccess) setTagList(tags?.data);
  }, [tags, isTagsSuccess]);

  return (
    <div className="w-full px-6 py-10">
      <ul className="mb-5 flex flex-wrap gap-2 rounded-md bg-slate-300 p-2">
        {interestList.map((interest) => (
          <li key={interest._id}>
            <FieldButton fieldName={interest.name} clickable />
          </li>
        ))}
      </ul>
      <CheckListWrapper
        isLoading={isTagsLoading}
        tags={tagList}
        error={tagsError}
      />
    </div>
  );
}
