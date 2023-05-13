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

export const setTokenHeader = (config: any, token: string) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

export const baseInstance = baseAPI(BASE_URL);
export const authInstance = authAPI(BASE_URL);
export const naverInstance = naverAPI(NAVER_URL);

// authInstance.interceptors.request.use(setTokenHeader);
