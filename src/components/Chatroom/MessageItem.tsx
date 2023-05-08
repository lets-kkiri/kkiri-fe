import React from 'react';
import {Text, View} from 'react-native';
import UserProfile from './UserProfile';
import Message from './Message';
import styled from 'styled-components/native';

// types
import {MessageData} from '../../types';

type MessageItemProp = {
  message: MessageData;
  isMe: boolean;
};

// Styled component
const MessageItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
`;

const MessageBubble = styled.View`
  background-color: #ffd8cc;
  padding: 8px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  font-size: 12px;
`;

function MessageItem({message, isMe}: MessageItemProp) {
  return (
    <MessageItemContainer>
      <UserProfile userImg={message.userImg} isMe={isMe} />
      <MessageBubble isMe={isMe}>
        <Text>{message.userName}</Text>
        <Message text={message.text} />
      </MessageBubble>
    </MessageItemContainer>
  );
}

export default MessageItem;
