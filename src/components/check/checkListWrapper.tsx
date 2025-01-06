'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { getMyTags } from '@/app/services/api/tags';
import { Tag } from '@/types/tag';

import AddNewTagWrapper from './addNewTagWrapper';
import CheckList from './checkList';

interface CheckListWrapperProps {
  isLoading: boolean;
  tags: undefined | Tag[];
  error: Error | null;
  isSuccess?: boolean;
}

export default function CheckListWrapper({
  isLoading,
  tags,
  error,
}: CheckListWrapperProps) {
  if (isLoading) return <div> loading...</div>;
  if (error) {
    console.log(error.message);
    return <div>error</div>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {tags &&
        tags.map((tag) => (
          <li key={tag._id}>
            <CheckList
              tagName={tag.name}
              tagId={tag._id}
              interest={tag.interest}
            />
          </li>
        ))}
      <li>
        <AddNewTagWrapper />
      </li>
    </ul>
  );
}
