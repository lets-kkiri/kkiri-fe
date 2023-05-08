import React from 'react';
import {View, Text} from 'react-native';
import UserProfile from './UserProfile';
import styled from 'styled-components/native';

// Styled components
const Bubble = styled.View`
  background-color: #ffd8cc;
  height: 40px;
  padding: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const UserNameText = styled.Text`
  color: #ff9270;
  font-size: 12px;
`;

const MessageText = styled.Text`
  color: #3a3a3a;
  font-size: 12px;
`;

import {MessageData} from '../../types';

type MessagePreviewProps = {
  message: MessageData;
};

const MessagePreview = ({message}: MessagePreviewProps) => {
  // 임시 데이터
  const userImg =
    'https://image.dongascience.com/Photo/2020/03/5bddba7b6574b95d37b6079c199d7101.jpg';
  const userName = '혜성';
  const text = '빨랑 좀 오셈 ㅎㅎ';

  return (
    <Bubble>
      <UserProfile userImg={userImg} />
      <UserNameText>{userName}</UserNameText>
      <MessageText>{text}</MessageText>
    </Bubble>
  );
};

export default MessagePreview;
