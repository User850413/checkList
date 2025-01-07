'use client';

import { getMyTags } from '@/app/services/api/tags';
import { Tag } from '@/types/tag';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import CheckListWrapper from '../check/checkListWrapper';
import { getMyInterest } from '@/app/services/api/interests';
import { interest } from '@/types/interest';
import FieldButton from '../common/fieldButton';

export default function TagBundle() {
  const queryClient = useQueryClient();

  const [tagList, setTagList] = useState<Tag[]>([]);
  const [interestList, setInterestList] = useState<interest[]>([]);
  const [interestFilter, setInterestFilter] = useState<string>('');
  // const [clickedButton, setClickedButton] = useState<{ id: null | string }>({
  //   id: null,
  // });

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
    queryFn: () => {
      if (interestFilter) {
        console.log(interestFilter);
        return getMyTags({ interest: interestFilter });
      }
      return getMyTags();
    },
  });

  useEffect(() => {
    if (isTagsSuccess) setTagList(tags?.data);
  }, [tags, isTagsSuccess]);

  const onClickInterestButton = (name: string, id: string) => {
    setInterestFilter(name);
    console.log(interestFilter);
    // setClickedButton({ id });
    // console.log(clickedButton);
    queryClient.invalidateQueries({ queryKey: ['tags', 'mine'] });
  };

  return (
    <div className="w-full px-6 py-10">
      <ul className="mb-5 flex flex-wrap gap-2 rounded-md bg-slate-300 p-2">
        {interestList.map((interest) => (
          <li key={interest._id}>
            <FieldButton
              fieldName={interest.name}
              clickable
              // isClicked={clickedButton.id === interest._id}
              onClickFn={() =>
                onClickInterestButton(interest.name, interest._id)
              }
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
