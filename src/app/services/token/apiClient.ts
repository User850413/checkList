import ERROR_MESSAGES from '@/app/lib/constants/errorMessages';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOST}/api`,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.config.url.includes('/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      try {
        await apiClient.post('/refresh');

        return apiClient.request(error.config);
      } catch (error) {
        console.error(ERROR_MESSAGES.EXPIRED_REFRESH_TOKEN.ko, error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
