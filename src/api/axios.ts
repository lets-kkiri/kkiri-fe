import axios from 'axios';
import {requests} from './requests';
import TokenRefreshService from './TokenRefreshService';

const BASE_URL = requests.base_url;
const NAVER_URL = requests.naver_url;

const baseAPI = (url: string, options?: any) => {
  return axios.create({baseURL: url, ...options});
};

const authAPI = (url: string, options?: any) => {
  return axios.create({baseURL: url, ...options});
};

const naverAPI = (url: string, options?: any) => {
  return axios.create({
    baseURL: url,
    headers: {
      'X-NCP-APIGW-API-KEY-ID': 'NAVER_CLIENT_ID',
      'X-NCP-APIGW-API-KEY': 'NAVER_API_KEY',
    },
    ...options,
  });
};

// export const setTokenHeader = (config: any) => {
//   config.headers.Authorization =
//     'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzgzMzc0NjQ4IiwiaXNzIjoiS0tJUkkiLCJleHAiOjE2OTYwMDU0NjMsImlhdCI6MTY4MzkwOTQ2M30.E6hPIi_78WVgRdbKsD5uIlVS8YQpj0eZC-QFzEkDFxv4MYJmHhOni9KdS77TGZNsQC5fJ8w_uEjCJNGVfLovSA';
//   // console.log(config);
// export const setTokenHeader = (config: any) => {
//   config.headers.Authorization =
//     'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzgzNTQ1NTA5IiwiaXNzIjoiS0tJUkkiLCJleHAiOjE2OTYzMDg5NTgsImlhdCI6MTY4NDIxMjk1OH0.vg4EIwT38rD8hdJ122lmEknRqHuWKLqAaKTeKumUf8jCNN4BFaJngEnxIBHEhPUsyio9tGjbmT-phnuHj9Pgvw';
//   // console.log(config);
//   return config;
// };

export const setTokenHeader = (config: any, token: string) => {
  console.log('setTokenHeader:', token);
  config.headers.common.Authorization = `Bearer ${token}`;
  return config;
};

export const baseInstance = baseAPI(BASE_URL);
export const authInstance = authAPI(BASE_URL);
export const naverInstance = naverAPI(NAVER_URL);

// authInstance.interceptors.request.use(setTokenHeader);

authInstance.interceptors.response.use(
  response => {
    // console.log('리스폰스입니다', response);
    return response;
  },
  async error => {
    const originalRequest = error.config;
    console.error(
      '에러입니다',
      error.config,
      '에러 번호',
      error.response.status,
    );
    if (
      (error.response.status === 400 ||
        error.response.status === 401 ||
        error.response.status === 403) &&
      !originalRequest._retry
    ) {
      console.log('아시오스 에러!', error.response.status);
      originalRequest._retry = true;
      const accessToken = await TokenRefreshService.refreshAccessToken();
      console.log('새로 받은 엑세스 토큰', accessToken);
      authInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      // console.log('디폴트 헤더:', axios.defaults.headers);
      return authInstance(originalRequest);
    }

    return Promise.reject(error);
  },
);
