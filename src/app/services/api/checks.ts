import axios from 'axios';

export async function getAllChecks() {
  const res = await axios.get('/api/checks');
  return res.data;
}

export async function getChecks({ tag }: { tag: string }) {
  // const res = await axios.get(`/api/checks?tag=${tag}`);
  // return res.data;

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

  const res = await axios.post(
    '/api/checks',
    { task, tag },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data;
}
