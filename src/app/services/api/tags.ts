import axios from 'axios';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { Tag } from '@/types/tag';

import apiClient from '../token/apiClient';


export async function getAllTags() {
  const res = await axios.get('/api/tags');
  return res.data;
}

export async function getMyTags() {
  try {
    const res = await apiClient.get('/tags/mine');
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function postTag({ name }: Pick<Tag, 'name'>) {
  const trimmedName = name.trim();

  if (!trimmedName) throw new Error(ERROR_MESSAGES.EMPTY_TAGNAME.ko);

  try {
    const res = await apiClient.post('/tags', {
      name: trimmedName,
    });
    return res.data;
  } catch (error) {
    console.error(`태그 생성 중 오류 발생 : ${error}`);
    throw error;
  }
}

export async function patchTag({ _id, name }: Partial<Tag>) {
  if (!_id?.trim()) throw new Error(ERROR_MESSAGES.EMPTY_ID.ko);
  if (!name?.trim()) throw new Error(ERROR_MESSAGES.EMPTY_TAGNAME.ko);

  try {
    const res = await apiClient.patch(`/tags?id=${_id}`, { name: name.trim() });
    return res.data;
  } catch (error) {
    console.error(`태그 항목 수정 중 오류 발생 : ${error}`);
    throw error;
  }
}

export async function deleteTag({ _id }: Pick<Tag, '_id'>) {
  if (!_id?.trim()) throw new Error(ERROR_MESSAGES.EMPTY_ID.ko);

  try {
    const res = await apiClient.delete(`/tags?id=${_id}`);
    return res.status;
  } catch (error) {
    throw error;
  }
}
