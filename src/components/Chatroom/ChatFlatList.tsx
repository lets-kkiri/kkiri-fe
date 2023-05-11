import React from 'react';
import {FlatList, View, Dimensions} from 'react-native';
import MessageItem from './MessageItem';
import styled from 'styled-components/native';

import {MessageData} from '../../types/index';

type ChatFlatListProp = {
  data: MessageData[];
  parentHeight: number;
};

// Styled component
const ChatListContainer = styled.View<{parentHeight: number}>`
  /* bottom: 0px; */
  /* padding-left: 16px; */
  /* padding-right: 16px; */
  height: ${Dimensions.get('window').height - 24 - 32 - 40 - 80}px;
  border-radius: 1px;
  border-color: blue;
`;
function ChatFlatList({data, parentHeight}: ChatFlatListProp) {
  return (
    <ChatListContainer parentHeight={parentHeight}>
      <FlatList
        data={data}
        renderItem={({item}) => <MessageItem message={item} />}
      />
    </ChatListContainer>
  );
}

export default ChatFlatList;
