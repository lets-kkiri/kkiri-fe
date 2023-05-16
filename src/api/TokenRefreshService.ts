import {requests} from './requests';
import EncryptedStorage from 'react-native-encrypted-storage';
import {authInstance, baseInstance} from './axios';

// 토큰 갱신 서비스
const TokenRefreshService = {
  async refreshAccessToken() {
    try {
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      console.log('refresh token: ', refreshToken);
      const response = await baseInstance.post(
        requests.GET_REISSUE(),
        {},
        {
          headers: {Authorization: `Bearer ${refreshToken}`},
          // headers: {authorization: `Bearer ${refreshToken}`},
        },
      );
      console.log('reissu body', response);
      const {accessToken, refreshToken: newRefreshToken} = response.data;
      await EncryptedStorage.setItem('refreshToken', newRefreshToken);
      authInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      return accessToken;
    } catch (err) {
      console.error('리프레쉬 서비스 에러입니다:', err.config);
      console.error('리프레쉬 서비스 에러입니다:', err);
    }
  },
};

export default TokenRefreshService;
