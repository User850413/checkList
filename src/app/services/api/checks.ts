import { Check } from '@/types/check';
import axios from 'axios';

export async function getAllChecks() {
  try {
    const res = await axios.get('/api/checks');
    return res.data;
  } catch (error) {
    console.error(`체크 항목 생성 중 오류 발생 : ${error}`);
    throw error;
  }
}

export async function getChecks({ tag }: { tag: string }) {
  try {
    const encodedTag = encodeURIComponent(tag);
    if (!encodedTag.trim()) throw new Error('태그 값이 유효하지 않습니다');

    const res = await axios.get(`/api/checks?tag=${encodedTag}`);
    return res.data;
  } catch (error) {
    console.error(`체크 목록 조회 중 오류 발생 : ${error}`);
    throw error;
  }
}

export async function postChecks({ task, tag }: Partial<Check>) {
  if (!task?.trim()) throw new Error('task는 필수 입력값입니다');
  if (!tag?.trim()) throw new Error('tag는 필수 입력값입니다');

  try {
    const res = await axios.post('/api/checks', {
      task: task.trim(),
      tag: tag.trim(),
    });
    return res.data;
  } catch (error) {
    console.error(`체크 항목 생성 중 오류 발생 : ${error}`);
    throw error;
  }
}

export async function patchChecks({ _id, task }: Partial<Check>) {
  if (!_id) throw new Error('id는 필수 입력값입니다');
  if (!task?.trim()) throw new Error('task는 필수 입력값입니다');

  try {
    const res = await axios.patch(`/api/checks?id=${_id}`, {
      task: task.trim(),
    });
    return res.data;
  } catch (error) {
    console.error(`체크 항목 수정 중 오류 발생 : ${error}`);
    throw error;
  }
}

export async function deleteCheck({ _id }: Pick<Check, '_id'>) {
  if (!_id?.trim()) throw new Error('id가 필요합니다');

  try {
    const res = await axios.delete(`/api/checks?id=${_id}`);
    return res.status;
  } catch (error) {
    console.error(`체크 항목 생성 중 오류 발생 : ${error}`);
    throw error;
  }
}
