import axios from 'axios';
import {requests} from './requests';
import EncryptedStorage from 'react-native-encrypted-storage';

// 토큰 갱신 서비스
const TokenRefreshService = {
  async refreshAccessToken() {
    const refreshToken = await EncryptedStorage.getItem('refreshToken');
    const response = await axios.post(`${requests.base_url}/api/auth/reissue`, {
      refreshToken,
    });

    const {accessToken, refreshToken: newRefreshToken} = response.data;
    await EncryptedStorage.setItem('refreshToken', newRefreshToken);

    return accessToken;
  },
};

export default TokenRefreshService;
