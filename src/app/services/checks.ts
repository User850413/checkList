import axios from 'axios';

export async function getChecks() {
  const res = await axios.get('/api/checks');
  return res.data;
}
