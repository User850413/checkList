import axios from 'axios';

export async function getChecks() {
  const res = await axios.get('/api/checks');
  return res.data;
}

export async function postChecks({ task }: Partial<Check>) {
  const res = await axios.post(
    '/api/checks',
    { task },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data;
}
