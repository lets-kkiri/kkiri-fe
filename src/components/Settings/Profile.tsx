import React, {useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import {WithLocalSvg} from 'react-native-svg';

// Icons
const RightOff = require('../../assets/icons/right_off.svg');
const RightOn = require('../../assets/icons/right_on.svg');

const ProfileContainer = styled.View`
  width: 343px;
  height: 211px;
  border: 1px;
  border-radius: 15px;
  border-color: #5968f2;
`;

const ProfileAccountContainer = styled.View`
  flex-direction: row;
  height: 146px;
`;

const ProfileContents = styled.View`
  flex-direction: column;
  width: 193px;
  padding: 20px;
  justify-content: space-between;
`;

const NameSpace = styled.View`
  flex-direction: row;
`;

const Name = styled.Text`
  font-weight: 700;
  color: #5968f2;
  font-size: 20;
`;

const Sir = styled.Text`
  font-weight: 600;
  color: #5968f2;
  font-size: 20;
`;

const AccountSpace = styled.View``;

const AccountSetting = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const ArrowContainer = styled.View`
  margin-left: 5px;
  width: 5px;
  height: 10px;
`;

const AccountText = styled.Text`
  color: #aeaeae;
  font-size: 14;
  font-weight: 600;
`;

const AccountListContainer = styled.View`
  height: 24px;
`;

const ProfileThumbnail = styled.Image`
  margin: 20px;
  width: 110px;
  height: 110px;
  border-radius: 15px;
`;

const ProfileSettingContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 12px;
  border-top-width: 1px;
  border-top-color: #5968f2;
`;

const ProfileSettingBtn = styled.TouchableOpacity`
  width: 142px;
  height: 40px;
  border-radius: 10px;
  background-color: #dde2fc;
  justify-content: center;
  align-items: center;
`;

const BtnText = styled.Text`
  color: #5968f2;
`;

export default function Profile() {
  const userInfo = useSelector((state: RootState) => state.persisted.user);

  useEffect(() => {
    console.log(userInfo);
  });

  if (!userInfo) {
    return null;
  }

  return (
    <ProfileContainer>
      <ProfileAccountContainer>
        <ProfileContents>
          <NameSpace>
            <Name>{userInfo.nickname}</Name>
            <Sir> 님</Sir>
          </NameSpace>
          <AccountSpace>
            <AccountSetting>
              <AccountText>계좌 연결</AccountText>
              <ArrowContainer>
                <WithLocalSvg asset={RightOn} height={10} width={5} />
              </ArrowContainer>
            </AccountSetting>
            <AccountListContainer />
          </AccountSpace>
        </ProfileContents>
        {userInfo && (
          <ProfileThumbnail source={{uri: userInfo.profileImageUrl}} />
        )}
      </ProfileAccountContainer>
      <ProfileSettingContainer>
        <ProfileSettingBtn>
          <BtnText>프로필 편집</BtnText>
        </ProfileSettingBtn>
        <ProfileSettingBtn>
          <BtnText>프로필 공유</BtnText>
        </ProfileSettingBtn>
      </ProfileSettingContainer>
    </ProfileContainer>
  );
}
