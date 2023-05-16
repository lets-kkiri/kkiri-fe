import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button, Text, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import styled from 'styled-components/native';
import {toggleTheme} from '../slices/themeSlice';

// 로그아웃 버튼
import {authInstance} from '../api/axios';
import {logout} from '@react-native-seoul/kakao-login';
import {requests} from '../api/requests';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';

authInstance;

function Setting() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const userInfo = useSelector((state: RootState) => state.persisted.user);

  const dispatch = useDispatch();
  const darkMode = useSelector(
    (state: RootState) => state.persisted.theme.darkmode,
  );

  // 로그아웃 버튼 위함
  const isLoggedIn = useSelector(
    (state: RootState) => state.persisted.user.isLoggedIn,
  );
  const signOutWithKakao = async (): Promise<void> => {
    if (isLoggedIn) {
      // 사용자가 로그인한 상태인지 확인
      console.log('로그아웃');
      try {
        const message = await logout();
        // setResult(message);
        const res = await authInstance.post(requests.SIGNOUT());
        if (res.status === 200) {
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
          dispatch(userSlice.actions.setIsLoggedIn(false));
          EncryptedStorage.removeItem('refreshToken');
          console.log('로그아웃');
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.log('User is not logged in');
    }
  };

  return (
    <SettingPageContainer>
      <SettingTitle>
        <Text>내 프로필 설정</Text>
      </SettingTitle>
      <View>
        <Text>{userInfo.nickname}님</Text>
        <Text>수정버튼</Text>
      </View>
      <View>
        <Text>계좌정보</Text>
      </View>
      <DivideLine />
      <Button
        title="채팅방 입장"
        onPress={() => navigation.navigate('Chatroom', {moimId: 9})}
      />
      {/* <Button title="지도" onPress={() => navigation.navigate('Map')} /> */}
      <Button
        title={darkMode ? '테마 : 다크' : '테마 : 라이트'}
        onPress={() => dispatch(toggleTheme())}
      />
      <Button
        title="카드 등록"
        onPress={() => navigation.navigate('AddCard')}
      />
      <Button title="로그아웃" onPress={() => signOutWithKakao()} />
    </SettingPageContainer>
  );
}

export default Setting;

// Styled Components
const SettingPageContainer = styled.View`
  padding: 16px;
`;
const SettingTitle = styled.View`
  height: 70px;
  /* padding: 16px; */
  display: flex;
  justify-content: center;
  /* align-items: center; */
`;
const DivideLine = styled.View`
  width: 100%;
`;
