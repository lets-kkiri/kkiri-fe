import React, {useEffect, useRef, useState} from 'react';
import ChatFlatList from './ChatFlatList';
import {View, Text} from 'react-native';
import styled from 'styled-components/native';
import {TextEncoder} from 'text-encoding';

// API
import {requests} from '../../api/requests';
import EmojiBtn from './EmojiBtn';

// Styled component
const ChatAreaContainer = styled.View`
  position: absolute;
  bottom: 0px;
  height: 100%;
  width: 100%;
  /* background-color: red; */
  display: flex;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const TextInputContainer = styled.View`
  /* position: absolute; */
  flex-direction: row;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  bottom: 0px;
  height: 48px;
  margin: 8px;
`;

const StyledTextInput = styled.TextInput`
  background-color: #ffd8cc;
  border-radius: 15px;
  border-color: #ff9270;
  border-width: 1px;
  width: 80%;
  margin-right: 4px;
`;

const TextSendBtn = styled.TouchableHighlight`
  background-color: #ff9270;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  /* padding: 16px; */
  width: 60px;
  color: white;
`;

const ChatArea = ({data, client, roomId}) => {
  const [inputValue, setInputValue] = useState('');

  const encoder = new TextEncoder();

  // 채팅메시지 발신
  const sendMessage = () => {
    console.log('client check :', client.current);
    client.current.publish({
      destination: requests.CHAT(roomId),
      body: JSON.stringify({
        message: 'Hello World',
      }),
    });
    setInputValue('');
  };

  return (
    <ChatAreaContainer>
      <ChatFlatList data={data} />
      <TextInputContainer>
        <StyledTextInput
          placeholder="메시지를 입력해주세요"
          onChangeText={text => {
            setInputValue(text);
          }}
          value={inputValue}
        />
        <TextSendBtn onPress={() => sendMessage()}>
          <Text>전송</Text>
        </TextSendBtn>
        <EmojiBtn />
      </TextInputContainer>
    </ChatAreaContainer>
  );
};

export default ChatArea;
