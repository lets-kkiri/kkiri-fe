import React, {useEffect, useState} from 'react';
import {FlatList, View, Dimensions, Text} from 'react-native';
import MessageItem from './MessageItem';
import styled from 'styled-components/native';

import {MessageData} from '../../types/index';

type ChatFlatListProp = {
  messages: MessageData[];
};

// Styled component
const ChatListContainer = styled.View`
  height: ${Dimensions.get('window').height - 24 - 32 - 40 - 80 - 16}px;
  border-radius: 1px;
  border-color: blue;
  margin-bottom: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

function ChatFlatList({messages}: ChatFlatListProp) {
  const [data, setData] = useState<MessageData[]>([]);

  useEffect(() => {
    setData(messages);
  }, [messages]);

  return (
    <ChatListContainer>
      {data?.length > 0 && (
        <FlatList
          inverted={true}
          data={data}
          renderItem={({item}) => {
            // 메시지 타입이 채팅 메시지인 경우
            if (item.messageType === 'MESSAGE') {
              return <MessageItem message={item} />;
            }
            // 메시지 타입이 재촉 메시지인 경우
            return <Text>{item.message}</Text>;
          }}
          keyExtractor={item => String(item.seq)}
        />
      )}
    </ChatListContainer>
  );
}

export default ChatFlatList;
