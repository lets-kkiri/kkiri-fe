import React, {useState} from 'react';
import ChatFlatList from './ChatFlatList';
import {
  TouchableHighlight,
  Dimensions,
  KeyboardAvoidingView,
  Vibration,
} from 'react-native';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';
import {useSelector} from 'react-redux';

// Types
import {MessageData} from '../../types';

import close_btn from '../../assets/icons/close_white.svg';
// const close_btn = require('../../assets/icons/close_white.svg');
const send_btn = require('../../assets/icons/chat_send_btn.svg');

// Components
import EmojiBtn from './EmojiBtn';
import {RootState} from '../../store';

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
  onPress: () => void;
  isEmojiSelected: boolean;
  selectedEmoji: string;
};

const ChatArea = ({
  messages,
  client,
  moimId,
  closeHandler,
  onPress,
  isEmojiSelected,
  selectedEmoji,
}: ChatAreaProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const userInfo = useSelector((state: RootState) => state.persisted.user);

  // 채팅메시지 발신
  const sendMessage = () => {
    if (!inputValue) {
      return;
    }
    const msg = JSON.stringify({
      type: 'MESSAGE',
      content: {
        moimId: moimId,
        kakaoId: userInfo.id,
        nickname: userInfo.nickname,
        message: inputValue.trim(),
      },
    });
    client.current.send(msg);
    Vibration.vibrate();
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
          <EmojiBtn
            onPress={onPress}
            isEmojiSelected={isEmojiSelected}
            selectedEmoji={selectedEmoji}
          />
        </InputContainer>
      </ChatAreaContainer>
    </KeyboardAvoidingView>
  );
};

export default ChatArea;
