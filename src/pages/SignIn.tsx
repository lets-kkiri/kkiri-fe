import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
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
// import {authInstance, setTokenHeader} from '../api/axios';
import CustomButton from '../components/Common/Button';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';
import {authInstance, setTokenHeader} from '../api/axios';

// Styled component
const CreateMoimConatiner = styled.View`
  flex-direction: column;
  flex: 1;
`;

const ContentsContainer = styled.View`
  flex: 0.85;
  flex-direction: column;
  align-items: center;
`;

const ButtonContainer = styled.View`
  flex: 0.15;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 20px;
  align-items: center;
`;

// Icons
const loginKkiri = require('../assets/icons/login_kkiri.svg');

function SignIn() {
  const {width, height} = Dimensions.get('window');
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
      // 토큰 문제 해결하고 난 뒤에 풀어줄 놈
      authInstance.interceptors.request.use(config =>
        setTokenHeader(config, userInfo.accessToken),
      );
      console.log('리스폰스 데이타 : ', response.data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const signOutWithKakao = async (): Promise<void> => {
    if (isLoggedIn) {
      // 사용자가 로그인한 상태인지 확인
      try {
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
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.log('User is not logged in');
    }
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
    <CreateMoimConatiner>
      <ContentsContainer>
        <WithLocalSvg asset={loginKkiri} height={width * 1.5} width={width} />
      </ContentsContainer>
      <ButtonContainer>
        {isLoggedIn === true ? (
          <CustomButton
            text="카카오 로그아웃"
            status="kakao"
            width="long"
            onPress={() => {
              signOutWithKakao();
            }}
          />
        ) : (
          <CustomButton
            text="카카오 로그인"
            status="kakao"
            width="long"
            onPress={() => {
              signInWithKakao();
            }}
          />
        )}
      </ButtonContainer>
    </CreateMoimConatiner>
  );
}

export default SignIn;
