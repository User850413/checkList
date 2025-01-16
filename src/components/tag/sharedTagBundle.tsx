'use client';

import { QueryKeys } from '@/app/lib/constants/queryKeys';
import { getSharedTag } from '@/app/services/api/tags';
import { SharedTag } from '@/types/tag';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import SharedTagCard from './sharedTagCard';

export default function SharedTagBundle() {
  const [tagData, setTagData] = useState<SharedTag[]>([]);

  // NOTE : sharedTag 불러오는 쿼리
  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: QueryKeys.SHARED_TAGS,
    queryFn: () => getSharedTag(),
  });

  useEffect(() => {
    if (isSuccess) {
      setTagData(data.data);
    }
  }, [data]);

  if (isError) return <div>Error</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <ul className="mt-5 grid grid-cols-1 gap-4 px-5 lg:grid-cols-2">
      {tagData.length !== 0 &&
        tagData.map((tag) => (
          <li key={tag._id}>
            <SharedTagCard id={tag._id} name={tag.name} list={tag.list} />
          </li>
        ))}
    </ul>
  );
}
