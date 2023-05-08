import {baseInstance} from './axios';
import {requests} from './requests';

export const post_guides = async (data: {}) => {
  await baseInstance.post(requests.POST_GUIDES(), data);
};

export const post_arrive = async (data: {}) => {
  await baseInstance.post(requests.POST_ARRIVE(), data);
};
