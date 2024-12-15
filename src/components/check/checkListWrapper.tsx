'use client';

import { useQuery } from '@tanstack/react-query';
import CheckList from './checkList';
import { getMyTags } from '@/app/services/api/tags';
import AddNewTagWrapper from './addNewTagWrapper';
import { useEffect, useState } from 'react';
import { Tag } from '@/types/tag';

export default function CheckListWrapper() {
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

  if (isLoading) return <div> loading...</div>;
  if (error) {
    console.log(error.message);
    return <div>error</div>;
  }

  return (
    <div className="w-full px-6 py-10">
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {tagList &&
          tagList.map((tag) => (
            <li key={tag._id}>
              <CheckList tagName={tag.name} tagId={tag._id} />
            </li>
          ))}
        <li>
          <AddNewTagWrapper />
        </li>
      </ul>
    </div>
  );
}
