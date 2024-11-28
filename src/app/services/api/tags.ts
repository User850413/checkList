import { Tag } from '@/types/tag';
import axios from 'axios';

export async function getAllTags() {
  const res = await axios.get('/api/tags');
  return res.data;
}

export async function postTag({ name }: Pick<Tag, 'name'>) {
  if (!name?.trim()) throw new Error('1자 이상 필수 입력입니다!');

  try {
    const res = await axios.post('/api/tags', {
      name: name.trim(),
    });
    return res.data;
  } catch (error) {
    console.error(`태그 생성 중 오류 발생 : ${error}`);
    throw error;
  }
}

export async function patchTag({ _id, name }: Partial<Tag>) {
  if (!_id?.trim()) throw new Error('id는 필수입니다!');
  if (!name?.trim()) throw new Error('1자 이상 필수 입력입니다!');

  try {
    const res = await axios.patch(`/api/tags?id=${_id}`, { name: name.trim() });
    return res.data;
  } catch (error) {
    console.error(`태그 항목 수정 중 오류 발생 : ${error}`);
    throw error;
  }
}

export async function deleteTag({ _id }: Pick<Tag, '_id'>) {
  if (!_id?.trim()) throw new Error('id가 필요합니다');

  try {
    const res = await axios.delete(`/api/tags?id=${_id}`);
    return res.status;
  } catch (error) {
    console.error(`태그 항목 삭제 중 오류 발생 : ${error}`);
    throw error;
  }
}
