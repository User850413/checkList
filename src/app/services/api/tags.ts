import axios from 'axios';

export async function getAllTags() {
  const res = await axios.get('/api/tags');
  return res.data;
}
