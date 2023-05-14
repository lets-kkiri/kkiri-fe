import React from 'react';
import {Text, View} from 'react-native';
import UserProfile from './UserProfile';
import Message from './Message';
import styled from 'styled-components/native';

// types
import {MessageData} from '../../types';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

type MessageItemProp = {
  message: MessageData;
};

// Styled component
const MessageItemContainer = styled.View<{isMe: boolean}>`
  flex-direction: row;
  justify-content: ${({isMe}) => (isMe ? 'flex-end' : 'flex-start')};
  align-items: center;
  margin-bottom: 16px;
  font-size: 12px;
`;

const MessageBubble = styled.View<{isMe: boolean}>`
  background-color: ${({isMe}) => (isMe ? '#FFF5F2' : '#ffd8cc')};
  padding: 8px;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 20px;
  border-bottom-left-radius: ${({isMe}) => (isMe ? 20 : 0)}px;
  border-bottom-right-radius: ${({isMe}) => (isMe ? 0 : 20)}px;
  font-size: 12px;
  margin-left: 12px;
`;

const Nickname = styled.Text`
  color: #ff9270;
`;

function MessageItem({message}: MessageItemProp) {
  // 나 자신
  const myId = useSelector((state: RootState) => state.persisted.user.id);
  const isMe = myId == message.kakaoId;
  return (
    <MessageItemContainer isMe={isMe}>
      {/* {!isMe && <UserProfile userImg={'sdf'} width={50} />} */}
      <MessageBubble isMe={isMe}>
        {!isMe && <Nickname>{message.nickname}</Nickname>}
        <Message text={message.message} />
      </MessageBubble>
    </MessageItemContainer>
  );
}

export default MessageItem;
