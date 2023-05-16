import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button, Text, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import styled from 'styled-components/native';
import {toggleTheme} from '../slices/themeSlice';

function Setting() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const userInfo = useSelector((state: RootState) => state.persisted.user);

  const dispatch = useDispatch();
  const darkMode = useSelector(
    (state: RootState) => state.persisted.theme.darkmode,
  );

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
