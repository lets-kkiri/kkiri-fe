import React, {useEffect, useRef, useState} from 'react';
import {View, Vibration, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import EmojiBtn from '../components/Chatroom/EmojiBtn';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

// Icons
const send_btn = require('../assets/icons/chat_send_btn.svg');

// API
import {requests} from '../api/requests';
import {authInstance, baseInstance} from '../api/axios';

// Components
import ChatArea from '../components/Chatroom/ChatArea';
import RealtimeMap from '../components/Chatroom/RealtimeMap';
import MessagePreview from '../components/Chatroom/MessagePreview';
import EmojiPicker from '../components/EmojiPicker/EmojiPicker';
import EmojiAnimation from '../components/EmojiAnimation/EmojiAnimation';

// types
import {MessageData, RootStackParamList} from '../types/index';

// Redux
import {RootState} from '../store';
import {WithLocalSvg} from 'react-native-svg';

interface ChatroomProp {
  route: RouteProp<RootStackParamList, 'Chatroom'>;
}

interface UserType {
  longitude: number;
  latitude: number;
}

type UsersType = {
  [key: number]: UserType;
};

// Style components
const MessagePreviewContainer = styled.View`
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 16px;
`;

const StyledTextInput = styled.TextInput`
  font-size: 12px;
  position: relative;
  bottom: -1px;
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

const TextSendBtn = styled.TouchableHighlight`
  position: absolute;
  right: 8px;
`;

type EmojiMessagesType = {
  [key: number]: MessageData[];
};

function Chatroom({route}: ChatroomProp) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [emojiMessages, setEmojiMessages] = useState<EmojiMessagesType>({});
  const [myEmojiMessages, setMyEmojiMessages] = useState<number[]>([]);
  const [showChatArea, setShowChatArea] = useState<boolean>(false);
  const [startDraw, setStartDraw] = useState<boolean>(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isEmojiSelected, setIsEmojiSelected] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [user, setUser] = useState<UsersType>();
  const [theTimerId, setTheTimerId] = useState<null | number>(null);
  const [animateCounter, setAnimateCounter] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');

  // 채팅방 id
  const moimId = route.params.moimId;
  const client = route.params.socket;
  // 나 자신
  const userInfo = useSelector((state: RootState) => state.persisted.user);
  console.log('moimId :', moimId);
  // socket 저장하는 변수
  const socket = useRef<WebSocket | null>(client);

  interface Data {
    meta: {
      lastMessageId: string;
      last: boolean;
    };
    chat: MessageData[];
  }

  useEffect(() => {
    console.log('====================  채팅방 ========================');
    // 이전 메시지 fetch
    const get_previous_chat = async (id: number) => {
      try {
        const {data} = await authInstance.get(requests.GET_CHAT(id, 20));
        if (data.chat) {
          setMessages(data.chat);
        }
        console.log('뭐냐', messages);
      } catch (error) {
        console.log('get previous chat error :', error);
      }
    };

    get_previous_chat(moimId);

    if (socket.current) {
      console.log('연결연결');
      console.log(moimId);
      // 메시지 수신 이벤트
      socket.current.onmessage = event => {
        console.log(event.data);
        const data = JSON.parse(event.data);
        console.log('onmessage :', data);
        // 채팅 메시지, 재촉 메시지인 경우
        if (data.messageType === 'MESSAGE' || data.messageType === 'URGENT') {
          let newMessages = [data];
          setMessages(prev => [...newMessages, ...prev]);
        }

        // 이모티콘인 경우
        if (data.messageType === 'EMOJI') {
          setEmojiMessages(prev => {
            const temp = {...prev};
            if (temp[data.kakaoId]) {
              temp[data.kakaoId] = [...temp[data.kakaoId], data];
            } else {
              temp[data.kakaoId] = [data];
            }

            console.log('emojis :', temp);
            return temp;
          });
        }

        // 모임원들의 실시간 위치일 경우
        if (data.type === 'GPS') {
          setUser(prev => {
            const temp = {...prev};
            temp[data.content.kakaoId] = {
              longitude: data.content.longitude,
              latitude: data.content.latitude,
            };
            console.log(temp);
            return temp;
          });
        }
      };

      socket.current.onerror = e => {
        console.log('socket error :', e);
      };

      socket.current.onclose = e => {
        console.log('socket close :', e.code, e.reason);
        console.log('소켓 연결 닫힘', e);
      };
    }
    return () => {
      console.log('=======================채팅방 나감========================');
      client.close(1000, 'Work complete');
    };
  }, [moimId, userInfo]);

  const sendEmoji = () => {
    setShowEmoji(false);
    if (theTimerId) {
      clearTimeout(theTimerId);
    }

    if (socket.current) {
      console.log('send emoji :', selectedEmoji);
      socket.current?.send(
        JSON.stringify({
          type: 'EMOJI',
          content: {
            moimId: moimId,
            kakaoId: userInfo.id,
            nickname: userInfo.nickname,
            message: selectedEmoji,
          },
        }),
      );

      Vibration.vibrate();
      setMyEmojiMessages(prev => [...prev, selectedEmoji]);
    }
  };

  const onSelect = (emoji: any) => {
    // 선택
    setIsEmojiSelected(true);
    setSelectedEmoji(emoji);

    // 그 전 타이머 지우기
    if (theTimerId) {
      clearTimeout(theTimerId);
    }

    // 새로운 타이머 생성
    const timerId = setTimeout(() => {
      setIsEmojiSelected(false);
      setSelectedEmoji('');
      setTheTimerId(null);
      // 3초 동안 상호작용이 없다면 타이머 지우기
      clearTimeout(timerId);
    }, 3000);

    // 새로운 타이머 저장
    setTheTimerId(timerId);
  };

  const closeEmojiPicker = () => {
    setShowEmoji(false);
  };

  const animateEmoji = () => {
    setAnimateCounter(prev => prev + 1);
    console.log(animateCounter);
    setEmojiMessages(prev => [
      ...prev,
      {
        kakaoId: 2785529705,
        message: '3',
        messageType: 'EMOJI',
        moimId: 94,
        nickname: '이은지',
        seq: 759,
        time: '2023-05-16 06:27:11.243391',
      },
    ]);
  };

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

    if (socket.current) {
      socket.current.send(msg);
      Vibration.vibrate();
      socket.current.onerror = e => {
        console.log('socket error :', e);
      };
      setInputValue('');
    }
  };

  return (
    <View style={{position: 'absolute', width: '100%', height: '100%'}}>
      {/* 이모지 */}
      {showEmoji && (
        <EmojiPicker onSelect={onSelect} onClose={() => closeEmojiPicker()} />
      )}
      {/* 지도 */}
      <RealtimeMap
        startDraw={startDraw}
        setStartDraw={setStartDraw}
        moimId={moimId}
        users={user ? user : null}
        socket={socket}
        emojiMessages={emojiMessages}
        myEmojiMessages={myEmojiMessages}
      />
      {/* 채팅 */}
      {showChatArea && (
        <ChatArea
          messages={messages}
          client={socket}
          moimId={moimId}
          closeHandler={() => {
            setShowChatArea(false);
            setShowEmoji(false);
          }}
          onPress={
            isEmojiSelected
              ? () => sendEmoji()
              : () => setShowEmoji(prev => !prev)
          }
          isEmojiSelected={isEmojiSelected}
          selectedEmoji={Number(selectedEmoji)}
        />
      )}
      {!startDraw && (
        <MessagePreviewContainer>
          {!showChatArea && (
            <MessagePreview
              message={messages ? messages[0] : null}
              onPress={() => {
                setShowChatArea(true);
                setShowEmoji(false);
              }}
            />
          )}
          {showChatArea && (
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
          )}
          {myEmojiMessages.length
            ? myEmojiMessages.map((emoji, index) => (
                <View style={{position: 'absolute', left: 30}}>
                  <EmojiAnimation index={String(emoji)} key={index} />
                </View>
              ))
            : null}
          <EmojiBtn
            onPress={
              isEmojiSelected
                ? () => {
                    sendEmoji();
                    onSelect(selectedEmoji);
                  }
                : () => setShowEmoji(prev => !prev)
            }
            isEmojiSelected={isEmojiSelected}
            selectedEmoji={Number(selectedEmoji)}
          />
        </MessagePreviewContainer>
      )}
    </View>
  );
}

export default Chatroom;
