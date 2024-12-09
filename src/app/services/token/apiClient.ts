import axios from 'axios';

let accessToken: null | string = null;
const apiClient = axios.create({ baseURL: '/api', withCredentials: true });

apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post('/api/refresh', null, {
          withCredentials: true,
        });

        if (refreshResponse.status === 200) {
          accessToken = refreshResponse.data.accessToken;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // window.location.href = '/login';
        console.log(refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
