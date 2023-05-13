import React, {useCallback, useEffect, useRef, useState} from 'react';
import ChatFlatList from './ChatFlatList';
import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import {TextEncoder} from 'text-encoding';
import {WithLocalSvg} from 'react-native-svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {useHeaderHeight} from '@react-navigation/elements';
import {useSelector} from 'react-redux';

// API
import {requests} from '../../api/requests';

// Types
import {MessageData} from '../../types';

import close_btn from '../../assets/icons/close_white.svg';
// const close_btn = require('../../assets/icons/close_white.svg');
const send_btn = require('../../assets/icons/chat_send_btn.svg');

// Components
import EmojiBtn from './EmojiBtn';
import {RootState} from '../../store/reducer';

// Styled component
const ChatAreaContainer = styled.ScrollView`
  flex: 1;
  height: 100%;
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 16px;
`;

const CloseBtnRow = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  top: 0px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  bottom: 0px;
`;

const TextInputContainer = styled.View`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffd8cc;
  border-radius: 15px;
  border-color: #ff9270;
  border-width: 1px;
  width: ${Dimensions.get('window').width - 48 - 32}px;
  padding-left: 8px;
  margin-right: 8px;
  height: 40px;
`;

const StyledTextInput = styled.TextInput`
  font-size: 12px;
  position: relative;
  bottom: -1px;
`;

const TextSendBtn = styled.TouchableHighlight`
  position: absolute;
  right: 8px;
`;

type ChatAreaProps = {
  messages: MessageData[];
  client: any;
  moimId: number;
  closeHandler: () => void;
  previousMessages: MessageData[];
  onPress: () => void;
};

const ChatArea = ({
  messages,
  client,
  moimId,
  closeHandler,
  previousMessages,
  onPress,
}: ChatAreaProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const userInfo = useSelector((state: RootState) => state.persisted.user);
  const accessToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzgzNTQ1NTA5IiwiaXNzIjoiS0tJUkkiLCJleHAiOjE2OTU5NTAzMjQsImlhdCI6MTY4Mzg1NDMyNH0.8J8MBeiWPMJPXZy8X5i49jw-LAUff_S7RZWv8pYKOOzogqc3JTuIJevoOMi_1ANy4OynvTKNjwsr517_fNYxKA';

  const headers = {
    Authorization:
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzgzNTQ1NTA5IiwiaXNzIjoiS0tJUkkiLCJleHAiOjE2OTU5NTAzMjQsImlhdCI6MTY4Mzg1NDMyNH0.8J8MBeiWPMJPXZy8X5i49jw-LAUff_S7RZWv8pYKOOzogqc3JTuIJevoOMi_1ANy4OynvTKNjwsr517_fNYxKA',
    // 'X-Custom-Header': 'myvalue',
  };

  // 채팅메시지 발신
  const sendMessage = () => {
    if (!inputValue) return;
    const msg = JSON.stringify({
      type: 'MESSAGE', //or EMOJI, URGENT
      content: {
        moimId: moimId, //e.g. 1
        kakaoId: userInfo.id, //e.g. 1
        nickname: userInfo.nickname,
        message: inputValue.trim(),
      },
    });
    client.current.send(msg);
    client.current.onerror = e => {
      console.log('socket error :', e);
    };
    setInputValue('');
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <ChatAreaContainer>
        <CloseBtnRow>
          <TouchableHighlight onPress={closeHandler}>
            <WithLocalSvg asset={close_btn} />
          </TouchableHighlight>
        </CloseBtnRow>
        <ChatFlatList messages={messages} />
        <InputContainer>
          <TextInputContainer>
            <StyledTextInput
              placeholder="메시지를 입력해주세요"
              onChangeText={text => {
                setInputValue(text);
              }}
              value={inputValue}
            />
            <TextSendBtn onPress={() => sendMessage()}>
              <WithLocalSvg asset={send_btn} />
            </TextSendBtn>
          </TextInputContainer>
          <EmojiBtn onPress={onPress} />
        </InputContainer>
      </ChatAreaContainer>
    </KeyboardAvoidingView>
  );
};

export default ChatArea;
