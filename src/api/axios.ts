import axios from 'axios';
import {requests} from './requests';

const BASE_URL = requests.api_base_url;

const baseAPI = (url: string, options?: any) => {
  return axios.create({baseURL: url, ...options});
};

const authAPI = (url: string, options?: any) => {
  return axios.create({baseURL: url, ...options});
};

export const baseInstance = baseAPI(BASE_URL);
export const authInstance = authAPI(BASE_URL);
