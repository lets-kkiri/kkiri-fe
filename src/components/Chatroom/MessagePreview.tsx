import React from 'react';
import {Dimensions, Text} from 'react-native';
import UserProfile from './UserProfile';
import styled from 'styled-components/native';

// Styled components
const Bubble = styled.TouchableOpacity`
  background-color: #ffd8cc;
  height: 40px;
  padding: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
  border-radius: 99px;
  border-bottom-left-radius: 0px;
`;

const UserNameText = styled.Text`
  color: #ff9270;
  font-size: 12px;
  margin-left: 8px;
`;

const MessageText = styled.Text`
  color: #3a3a3a;
  font-size: 12px;
  margin-left: 8px;
`;

import {MessageData} from '../../types';

type MessagePreviewProps = {
  message?: MessageData | null;
  onPress: () => void;
};

const MessagePreview = ({message, onPress}: MessagePreviewProps) => {
  // 임시 데이터
  const userImg =
    'https://image.dongascience.com/Photo/2020/03/5bddba7b6574b95d37b6079c199d7101.jpg';

  return (
    <Bubble
      style={{width: Dimensions.get('window').width - 78}}
      activeOpacity={0.8}
      onPress={onPress}>
      {message && (
        <>
          <UserProfile userImg={userImg} width={32} />
          <UserNameText>{message.nickname}</UserNameText>
          <MessageText>{message.message}</MessageText>
        </>
      )}
      {!message && <Text>친구들과 채팅을 시작해보세요</Text>}
    </Bubble>
  );
};

export default MessagePreview;
