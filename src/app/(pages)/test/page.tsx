'use client';

import apiClient from '@/app/services/token/apiClient';
import axios from 'axios';

export default function Test() {
  // const [myData, setMyData] = useState([]);

  // const { data } = useQuery({
  //   queryKey: ['me'],
  //   queryFn: async () => await getMyDataAgain(),
  // });

  apiClient.get('/tags/mine/statistics');
  return <>hello</>;
}
