import axios from 'axios';
const redirectionPaths = ['/', '/login', '/signup'];

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOST}/api`,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    // 토큰 인증 성공 시 리다이렉션
    if (response.status === 200) {
      if (
        redirectionPaths.includes(window.location.pathname) &&
        !response.config.url?.includes('status')
      )
        window.location.href = '/my-list';
    }
    return response;
  },
  async (error) => {
    // refresh 요청 실패 시 요청 중단
    if (error.config.url.includes('/refresh')) {
      return Promise.reject(error);
    }

    // 토큰 만료 시 refresh 요청
    if (error.response?.status === 401) {
      try {
        await apiClient.post('/refresh');

        return apiClient.request(error.config);
      } catch (error) {
        // 토큰 인증 실패 시 리다이렉션
        if (window.location.pathname === '/') {
          window.location.href = '/landing';
        }
        if (
          window.location.pathname !== '/' &&
          !redirectionPaths.includes(window.location.pathname)
        ) {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
