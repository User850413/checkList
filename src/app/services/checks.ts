import axios from 'axios';

export async function getAllChecks() {
  const res = await axios.get('/api/checks');
  return res.data;
}

export async function getChecks({ tag }: { tag: string }) {
  const res = await axios.get(`/api/checks/${tag}`);
  return res.data;
}

export async function postChecks({ task, tag }: Partial<Check>) {
  console.log(`tag: ${tag}`);

  const res = await axios.post(
    '/api/checks',
    { task, tag },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data;
}
