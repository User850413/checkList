'use client';

import { useQuery } from '@tanstack/react-query';
import CheckList from './checkList';
import { Tag } from '@/types/tag';
import { getAllTags } from '@/app/services/api/tags';

export default function CheckListWrapper() {
  const { isLoading, data: tags } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => getAllTags(),
  });

  console.log(tags);

  if (isLoading) return <div> loading...</div>;

  return (
    <div className="bg-green-200 w-full">
      <ul className="grid grid-cols-2 gap-4">
        {tags?.map((tag) => (
          <li key={tag._id}>
            <CheckList tag={tag.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}
