import axios from 'axios';

const apiClient = axios.create({ baseURL: '/api' });

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      const refreshToken = sessionStorage.getItem('refreshToken');
      const refreshResponse = await axios.post('/api/refresh', {
        refreshToken,
      });

      if (refreshResponse.status === 200) {
        const newAccessToken = refreshResponse.data.accessToken;

        error.config.header.Authorization = `Bearer ${newAccessToken}`;
        return axios(error.config);
      }
    } else {
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
