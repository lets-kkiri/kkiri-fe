import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import styled from 'styled-components/native';
import {toggleTheme} from '../slices/themeSlice';
import Profile from '../components/Settings/Profile';
import {WithLocalSvg} from 'react-native-svg';

// 로그아웃 버튼
import {authInstance} from '../api/axios';
import {logout} from '@react-native-seoul/kakao-login';
import {requests} from '../api/requests';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';

// Styled Components
const SettingPageContainer = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #fff;
  align-items: center;
`;
const SettingTitle = styled.View`
  height: 70px;
  /* padding: 16px; */
  display: flex;
  justify-content: center;
  /* align-items: center; */
`;
const DivideLine = styled.View`
  width: 110%;
  height: 8px;
  background-color: #f4f4f4;
  margin-top: 20px;
  margin-bottom: 5px;
`;

const ButtonContainer = styled.View`
  width: 100%;
`;

const SettingText = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;

const SettingBtn = styled.TouchableOpacity`
  height: 55px;
  border-bottom-width: 1px;
  border-bottom-color: #e2e2e2;
  margin: 0px 8px 0px 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const IconContainer = styled.View``;

const Theme = styled.Image`
  height: 20px;
`;

const styles = StyleSheet.create({
  themeImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
});

// Icons
const Right = require('../assets/icons/right.svg');

function Setting() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const userInfo = useSelector((state: RootState) => state.persisted.user);

  const dispatch = useDispatch();
  const darkMode = useSelector(
    (state: RootState) => state.persisted.theme.darkmode,
  );

  // 로그아웃 버튼 로직
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
        console.error('setting 에러 :', error.message);
      }
    } else {
      console.log('User is not logged in');
    }
  };

  return (
    <SettingPageContainer>
      <Profile />
      <DivideLine />
      <ButtonContainer>
        <SettingBtn onPress={() => dispatch(toggleTheme())}>
          <SettingText>테마 설정</SettingText>
          <Theme
            source={
              darkMode
                ? require('../assets/mypage/time_icon.png')
                : require('../assets/mypage/day_icon.png')
            }
            style={styles.themeImage}
          />
        </SettingBtn>
        {/* <SettingBtn onPress={() => navigation.navigate('AddCard')}>
          <Text>카드 등록</Text>
        </SettingBtn> */}
        {/* <SettingBtn
          title="AR Navigation"
          onPress={() => navigation.navigate('ARnavi')}
        /> */}
        <SettingBtn onPress={() => console.log('알림 설정')}>
          <SettingText>알림 설정</SettingText>
          <IconContainer>
            <WithLocalSvg asset={Right} width={6} height={12} />
          </IconContainer>
        </SettingBtn>
        <SettingBtn onPress={() => signOutWithKakao()}>
          <SettingText>로그아웃</SettingText>
        </SettingBtn>
      </ButtonContainer>
    </SettingPageContainer>
  );
}

export default Setting;
