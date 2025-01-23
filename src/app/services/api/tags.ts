import axios from 'axios';

import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import { Tag, TagRequest } from '@/types/tag';

import apiClient from '../token/apiClient';

export async function getAllTags() {
  const res = await axios.get('/api/tags');
  return res.data;
}

export async function getMyTags(params?: {
  interest?: string;
  isCompleted?: string;
  limit?: number;
  page?: number;
}) {
  try {
    let query = '';
    if (params) {
      const searchParams = new URLSearchParams();

      if (params.interest !== undefined)
        searchParams.append('interest', params.interest);

      if (params.isCompleted !== undefined)
        searchParams.append('isCompleted', params.isCompleted);

      if (params.limit !== undefined)
        searchParams.append('limit', params.limit.toString());

      if (params.page !== undefined)
        searchParams.append('page', params.page.toString());

      query = `?${searchParams}`;
    }

    const res = await apiClient.get(`/tags/mine${query}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function postTag({ name, interest }: TagRequest) {
  const trimmedName = name.trim();
  let trimmedInterest = interest.trim();

  if (!trimmedName) throw new Error(ERROR_MESSAGES.EMPTY_TAGNAME.ko);
  if (!trimmedInterest) trimmedInterest = '기타';

  try {
    const res = await apiClient.post('/tags', {
      name: trimmedName,
      interest: trimmedInterest,
    });
    return res.data;
  } catch (error) {
    console.error(`태그 생성 중 오류 발생 : ${error}`);
    throw error;
  }
}

// NOTE : 수정하기!!
export async function patchTag(props: {
  _id: string;
  name?: string;
  isCompleted?: boolean;
}) {
  try {
    if (!props._id.trim()) throw new Error(ERROR_MESSAGES.EMPTY_ID.ko);
    if (props.name !== undefined && props.name.length == 0)
      throw new Error(ERROR_MESSAGES.EMPTY_TAGNAME.ko);
    if (
      props.isCompleted !== undefined &&
      typeof props.isCompleted !== 'boolean'
    )
      throw new Error(ERROR_MESSAGES.TYPE_BOOLEAN_ERROR.ko);

    const filter = {
      ...(props.name && { name: props.name }),
      ...(props.isCompleted !== undefined && {
        isCompleted: props.isCompleted,
      }),
    };

    const res = await apiClient.patch(`/tags?id=${props._id}`, filter);
    return res.data;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw error;
  }
}

export async function completeTag({ id }: { id: string }) {
  if (!id?.trim()) throw new Error(ERROR_MESSAGES.EMPTY_ID.ko);

  try {
    const res = await apiClient.patch(`/tags/mine?id=${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw error;
  }
}

export async function deleteTag({ _id }: Pick<Tag, '_id'>) {
  if (!_id?.trim()) throw new Error(ERROR_MESSAGES.EMPTY_ID.ko);

  try {
    const res = await apiClient.delete(`/tags/mine?id=${_id}`);
    return res.status;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw error;
  }
}

export async function getSharedTag() {
  try {
    const res = await apiClient.get('/tags/share');
    return res.data;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw error;
  }
}

export async function shareTag({ id }: { id: string }) {
  if (!id?.trim()) throw new Error(ERROR_MESSAGES.EMPTY_ID.ko);

  try {
    const res = await apiClient.post(`/tags/share?id=${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw error;
  }
}

export async function takeSharedTag({ id }: { id: string }) {
  if (!id?.trim()) throw new Error(ERROR_MESSAGES.EMPTY_ID.ko);

  try {
    const res = await apiClient.post(`/tags/take?id=${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw error;
  }
}
