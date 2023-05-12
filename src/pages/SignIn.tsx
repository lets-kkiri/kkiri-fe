import React, {useState, useEffect} from 'react';
import {Button, View, StyleSheet} from 'react-native';
import {
  KakaoOAuthToken,
  KakaoProfile,
  getProfile,
  login,
  logout,
  unlink,
} from '@react-native-seoul/kakao-login';
import {requests} from '../api/requests';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {RootState} from '../store/index';

function SignIn() {
  const [result, setResult] = useState('');
  const isLoggedIn = useSelector(
    (state: RootState) => state.persisted.user.isLoggedIn,
  );
  const user = useSelector((state: RootState) => state.persisted.user);

  const dispatch = useDispatch();

  const signInWithKakao = async (): Promise<void> => {
    try {
      const token: KakaoOAuthToken = await login();
      // setResult(JSON.stringify(token));

      const profile: KakaoProfile = await getProfile();
      // setResult(JSON.stringify(profile));

      const requestBody = {
        id: profile.id,
        email: profile.email,
        nickname: profile.nickname,
        profileImageUrl: profile.profileImageUrl,
      };

      // console.log(requests.SIGNIN());

      // 로그인 요청
      const response = await axios.post(requests.SIGNIN(), requestBody);
      const userInfo = {
        ...requestBody,
        accessToken: response.data.accessToken,
        deviceTokens: [...response.data.deviceTokens],
        isLoggedIn: true,
      };
      // console.log(userInfo);
      // user slice에 저장
      dispatch(userSlice.actions.setUser({...userInfo}));
      // refreshToken 저장
      await EncryptedStorage.setItem(
        'refreshToken',
        response.data.refreshToken,
      );
      // console.log('리스폰스 데이타 : ', response.data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const signOutWithKakao = async (): Promise<void> => {
    const message = await logout();
    // setResult(message);
    const userInfo = {
      id: '',
      email: '',
      nickname: '',
      profileImageUrl: '',
      accessToken: '',
      isLoggedIn: false,
      deviceTokens: [],
    };
    dispatch(userSlice.actions.setUser({...userInfo}));
    EncryptedStorage.removeItem('refreshToken');
    // setIsLoggedin(false);
  };

  const unlinkKakao = async (): Promise<void> => {
    const message = await unlink();
    // setResult(message);
  };

  useEffect(() => {
    console.log('isLoggedIn changed: ', isLoggedIn);
    console.log('login info: ', user);
  }, [isLoggedIn, user]);

  return (
    <View style={styles.container}>
      {isLoggedIn === true ? (
        <View>
          <Button
            title="카카오 로그아웃"
            onPress={() => {
              signOutWithKakao();
            }}
          />
          <Button
            title="카카오 링크 해제"
            onPress={() => {
              unlinkKakao();
            }}
          />
        </View>
      ) : (
        <Button
          title="카카오 로그인"
          onPress={() => {
            signInWithKakao();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  button: {
    backgroundColor: '#FEE500',
    borderRadius: 40,
    borderWidth: 1,
    width: 250,
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  text: {
    textAlign: 'center',
  },
});

export default SignIn;
