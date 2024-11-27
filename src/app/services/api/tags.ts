import { Tag } from '@/types/tag';
import axios from 'axios';

export async function getAllTags() {
  const res = await axios.get('/api/tags');
  return res.data;
}

export async function postTag() {}

export async function deleteTag({ _id }: Pick<Tag, '_id'>) {
  if (!_id?.trim()) throw new Error('id가 필요합니다');

  // try{
  //   const res = await axios.delete(`api/checks`)
  // }
}
