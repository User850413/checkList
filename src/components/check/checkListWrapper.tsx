'use client';

import { useQuery } from '@tanstack/react-query';
import CheckList from './checkList';
import { Tag } from '@/types/tag';
import { getAllTags } from '@/app/services/api/tags';
import AddNewTag from './addNewTag';

export default function CheckListWrapper() {
  const { isLoading, data: tags } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => getAllTags(),
  });

  if (isLoading) return <div> loading...</div>;

  return (
    <div className="bg-slate-50 w-full px-6 py-10">
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {tags?.map((tag) => (
          <li key={tag._id}>
            <CheckList tagName={tag.name} tagId={tag._id} />
          </li>
        ))}
        <li>
          <AddNewTag />
        </li>
      </ul>
    </div>
  );
}
