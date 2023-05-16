import {requests} from './requests';
import EncryptedStorage from 'react-native-encrypted-storage';
import {baseInstance} from './axios';

// 토큰 갱신 서비스
const TokenRefreshService = {
  async refreshAccessToken() {
    const refreshToken = await EncryptedStorage.getItem('refreshToken');
    const response = await baseInstance.post(
      requests.GET_REISSUE(),
      {},
      {
        headers: {authorization: `Bearer ${refreshToken}`},
      },
    );
    console.log('refresh token: ', refreshToken);
    const {accessToken, refreshToken: newRefreshToken} = response.data;
    await EncryptedStorage.setItem('refreshToken', newRefreshToken);

    return accessToken;
  },
};

export default TokenRefreshService;
