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
    <div className="bg-slate-50 w-full px-6 py-10">
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {tags?.map((tag) => (
          <li key={tag._id}>
            <CheckList tag={tag.name} />
          </li>
        ))}
        <li className="bg-slate-200 rounded-lg cursor-pointer flex items-center justify-center py-4 text-slate-400 text-4xl">
          <span role="button">+</span>
        </li>
      </ul>
    </div>
  );
}
