import React from 'react';
import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {RootState} from '../../store';

// Styled component
export const ProfileImage = styled.Image`
  width: 24px;
  height: 24px;
  background-color: ${({theme}) => theme.color.blue2};
  border-radius: 99px;
  margin-right: 12px;
`;

export const Container = styled.View<{width: number; theme: any}>`
  width: ${({width}) => width / 3}px;
  background-color: ${({theme}) => theme.color.backBlue};
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  padding: 12px;
  padding-right: 16px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

interface Member {
  kakaoId: string;
  profileImage: string;
  nickname: string;
}

interface MemberItemProp {
  member: Member;
  width: number;
}

const MemberItem = ({member, width}: MemberItemProp) => {
  const theme = useSelector((state: RootState) => state.persisted.theme.theme);

  return (
    <Container width={width} theme={theme}>
      <ProfileImage source={{uri: member.profileImage}} />
      <Text style={{color: theme.color.text, fontSize: 14}}>
        {member.nickname}
      </Text>
    </Container>
  );
};

export default MemberItem;
