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

export const setTokenHeader = (config: any) => {
  config.headers.Authorization =
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzgzMzc0NjQ4IiwiaXNzIjoiS0tJUkkiLCJleHAiOjE2OTYwMDU0NjMsImlhdCI6MTY4MzkwOTQ2M30.E6hPIi_78WVgRdbKsD5uIlVS8YQpj0eZC-QFzEkDFxv4MYJmHhOni9KdS77TGZNsQC5fJ8w_uEjCJNGVfLovSA';
  // console.log(config);
  return config;
};

// export const setTokenHeader = (config: any, token: string) => {
//   config.headers.Authorization = `Bearer ${token}`;
//   return config;
// };

export const baseInstance = baseAPI(BASE_URL);
export const authInstance = authAPI(BASE_URL);
export const naverInstance = naverAPI(NAVER_URL);

authInstance.interceptors.request.use(setTokenHeader);

// authInstance.interceptors.response.use(
//   response => {
//     return response;
//   },
//   async error => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const accessToken = await TokenRefreshService.refreshAccessToken();
//       axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//       return authInstance(originalRequest);
//     }

//     return Promise.reject(error);
//   },
// );
