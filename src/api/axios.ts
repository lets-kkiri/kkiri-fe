import axios from 'axios';
import {requests} from './requests';

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

const setTokenHeader = (config: any) => {
  config.headers.Authorization =
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzgzMzc0NjQ4IiwiaXNzIjoiS0tJUkkiLCJleHAiOjE2OTYwMDU0NjMsImlhdCI6MTY4MzkwOTQ2M30.E6hPIi_78WVgRdbKsD5uIlVS8YQpj0eZC-QFzEkDFxv4MYJmHhOni9KdS77TGZNsQC5fJ8w_uEjCJNGVfLovSA';
  return config;
};

export const baseInstance = baseAPI(BASE_URL);
export const authInstance = authAPI(BASE_URL);
export const naverInstance = naverAPI(NAVER_URL);

authInstance.interceptors.request.use(setTokenHeader);
