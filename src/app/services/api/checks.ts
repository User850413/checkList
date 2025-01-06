import { Check, CheckRequest } from '@/types/check';

import apiClient from '../token/apiClient';

export async function getAllChecks() {
  try {
    const res = await apiClient.get('/checks');
    return res.data;
  } catch (error) {
    console.error(`체크 항목 생성 중 오류 발생 : ${error}`);
    throw error;
  }
}

export async function getChecks({ tagId }: { tagId: string }) {
  try {
    const encodedTag = encodeURIComponent(tagId);
    if (!encodedTag.trim()) throw new Error('태그 id값이 유효하지 않습니다');

    const res = await apiClient.get(`/checks?tagId=${encodedTag}`);
    return res.data;
  } catch (error) {
    console.error(`체크 목록 조회 중 오류 발생 : ${error}`);
    throw error;
  }
}

export async function postChecks({ task, tagId }: Partial<Check>) {
  if (!task?.trim()) throw new Error('task는 필수 입력값입니다');
  if (!tagId?.trim()) throw new Error('tagId는 필수 입력값입니다');

  try {
    const res = await apiClient.post('/checks', {
      task: task.trim(),
      tagId: tagId.trim(),
    });
    return res.data;
  } catch (error) {
    console.error(`체크 항목 생성 중 오류 발생 : ${error}`);
    throw error;
  }
}

export async function patchChecks(
  _id: string,
  data: Pick<CheckRequest, 'isCompleted'> | Pick<CheckRequest, 'task'>,
) {
  if (!_id) throw new Error('id는 필수 입력값입니다');

  if ('task' in data) {
    const { task } = data;
    if (task !== undefined && task !== null && task.length === 0)
      throw new Error('task는 0자 이상이어야 합니다');
  }

  try {
    const res = await apiClient.patch(`/checks?id=${_id}`, data);
    return res.data;
  } catch (error) {
    console.error(`체크 항목 수정 중 오류 발생 : ${error}`);
    throw error;
  }
}

export async function deleteCheck({ _id }: Pick<Check, '_id'>) {
  if (!_id?.trim()) throw new Error('id가 필요합니다');

  try {
    const res = await apiClient.delete(`/checks?id=${_id}`);
    return res.status;
  } catch (error) {
    console.error(`체크 항목 생성 중 오류 발생 : ${error}`);
    throw error;
  }
}
