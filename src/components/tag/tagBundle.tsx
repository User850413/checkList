'use client';

import { getMyTags } from '@/app/services/api/tags';
import { Tag } from '@/types/tag';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import CheckListWrapper from '../check/checkListWrapper';

export default function TagBundle() {
  const [tagList, setTagList] = useState<Tag[]>([]);

  const {
    isLoading,
    data: tags,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['tags', 'mine'],
    queryFn: () => getMyTags(),
  });

  useEffect(() => {
    if (isSuccess) setTagList(tags?.data);
  }, [tags, isSuccess]);

  return (
    <div className="w-full px-6 py-10">
      <ul className="mb-5 flex flex-wrap gap-2">
        <li>관심사1</li>
        <li>관심사2</li>
        <li>관심사3</li>
      </ul>
      <CheckListWrapper isLoading={isLoading} tags={tagList} error={error} />
    </div>
  );
}
