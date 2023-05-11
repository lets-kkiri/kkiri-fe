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

const close_btn = require('../../assets/icons/close_white.svg') as string;
const send_btn = require('../../assets/icons/chat_send_btn.svg') as string;

// Components
import EmojiBtn from './EmojiBtn';
import DismissKeyboardView from '../DismissKeyboardView';
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

const InputContainer = styled.View<{keyboardHeight: number}>`
  flex-direction: row;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  margin-bottom: ${({keyboardHeight}) => keyboardHeight}px;
  bottom: 0px;
`;

const TextInputContainer = styled.View<{parentWidth: number}>`
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

const StyledTextInput = styled.TextInput<{parentWidth: number}>`
  font-size: 12px;
  position: relative;
  bottom: -1px;
  width: ${({parentWidth}) => parentWidth}px;
`;

const TextSendBtn = styled.TouchableHighlight`
  position: absolute;
  right: 8px;
`;

type ChatAreaProps = {
  data: MessageData[];
  client: any;
  moimId: number;
};

const ChatArea = ({data, client, moimId}: ChatAreaProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const socket = useSelector((state: RootState) => state.socket.value); // 수정필요
  const userInfo = useSelector((state: RootState) => state.user);

  // 채팅메시지 발신
  const sendMessage = () => {
    console.log('client check :', client.current);
    const msg = JSON.stringify({
      type: 'MESSAGE', //or EMOJI, URGENT
      content: {
        moimId: moimId, //e.g. 1
        memberId: userInfo.memberId, //e.g. 1
        nickname: userInfo.nickname,
        message: inputValue.trim(),
      },
    });
    socket.send(msg);
    setInputValue('');
  };

  // header 높이
  const headerHeight = useHeaderHeight();

  // 부모 요소의 높이 혹은 넓이 구하는 로직 (사용하지 않음)
  const [inputConWidth, setInputConWidth] = useState<number>(0);
  const [chatAreaConHeight, setChatAreaConHeight] = useState<number>(0);
  const [textInputConWidth, setTextInputConWidth] = useState<number>(0);

  const onChatAreaConLayout = useCallback(event => {
    const {height} = event.nativeEvent.layout;
    setChatAreaConHeight(height);
  }, []);

  const onInputConLayout = useCallback(event => {
    const {width} = event.nativeEvent.layout;
    setInputConWidth(width);
  }, []);

  const onTextInputConLayout = useCallback(event => {
    const {width} = event.nativeEvent.layout;
    setTextInputConWidth(width);
  }, []);

  // textinput 움직이기
  const [keyboardh, setKeyboardh] = useState(0);
  const {height: windowHeight} = Dimensions.get('window');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        const keyboardHeight = event.endCoordinates.height;
        const screenHeight = windowHeight;
        const remainingHeight = screenHeight - keyboardHeight;
        setKeyboardh(keyboardHeight);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardh(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 64 : 0;

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <ChatAreaContainer onLayout={onChatAreaConLayout}>
        <CloseBtnRow>
          <TouchableHighlight>
            <WithLocalSvg asset={close_btn} />
          </TouchableHighlight>
        </CloseBtnRow>
        <ChatFlatList data={data} parentHeight={chatAreaConHeight} />
        <InputContainer onLayout={onInputConLayout} keyboardHeight={keyboardh}>
          <DismissKeyboardView>
            <TextInputContainer
              parentWidth={inputConWidth}
              onLayout={onTextInputConLayout}>
              <TextInput
                placeholder="메시지를 입력해주세요"
                onChangeText={text => {
                  setInputValue(text);
                }}
                value={inputValue}
                // parentWidth={textInputConWidth}
              />
              <TextSendBtn onPress={() => sendMessage()}>
                <WithLocalSvg asset={send_btn} />
              </TextSendBtn>
            </TextInputContainer>
          </DismissKeyboardView>
          <EmojiBtn />
        </InputContainer>
      </ChatAreaContainer>
    </KeyboardAvoidingView>
  );
};

export default ChatArea;
