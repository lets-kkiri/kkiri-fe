import React from 'react';
import {FlatList, View} from 'react-native';
import MessageItem from './MessageItem';
import styled from 'styled-components/native';

import {MessageData} from '../../types/index';

type ChatFlatListProp = {
  data: MessageData[];
};

// Styled component
const ChatListContainer = styled.View`
  /* bottom: 0px; */
  padding-left: 16px;
  padding-right: 16px;
  height: 80%;
  border-radius: 1px;
  border-color: blue;
`;

function ChatFlatList({data}: ChatFlatListProp) {
  return (
    <ChatListContainer>
      <FlatList
        data={data}
        renderItem={({item}) => <MessageItem message={item} />}
      />
    </ChatListContainer>
  );
}

export default ChatFlatList;
