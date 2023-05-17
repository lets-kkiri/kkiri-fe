import React, {useEffect, useRef, useState} from 'react';
import {View, Vibration} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import EmojiBtn from '../components/Chatroom/EmojiBtn';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

// API
import {requests} from '../api/requests';
import {baseInstance} from '../api/axios';

// Components
import ChatArea from '../components/Chatroom/ChatArea';
import RealtimeMap from '../components/Chatroom/RealtimeMap';
import MessagePreview from '../components/Chatroom/MessagePreview';
import EmojiPicker from '../components/EmojiPicker/EmojiPicker';

// types
import {MessageData, RootStackParamList} from '../types/index';

// Redux
import {RootState} from '../store';

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

function Chatroom({route}: ChatroomProp) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [showChatArea, setShowChatArea] = useState<boolean>(false);
  const [startDraw, setStartDraw] = useState<boolean>(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isEmojiSelected, setIsEmojiSelected] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  // const [user, setUser] = useState<UserType | null>();
  const [user, setUser] = useState<UsersType>();
  // const [socket, SetSocket] = useState<WebSocket | null>(null);
  const [theTimerId, setTheTimerId] = useState<null | number>(null);

  // 채팅방 id
  const moimId = route.params.moimId;
  const client = route.params.socket;
  // 나 자신
  const userInfo = useSelector((state: RootState) => state.persisted.user);

  // socket 저장하는 변수
  // const socket = locationUpdater({moimId: 9, myId: myId});
  // const socket = new WebSocket(`wss://k8a606.p.ssafy.io/ws/api/${moimId}`);
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
        const {data} = await baseInstance.get(requests.GET_CHAT(id, 20));
        setMessages(data.chat);
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
        if (event.data.messageType === 'EMOJI') {
          // setMessages(prev => [...prev, event.data]);
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
      };
    }
    return () => {
      console.log('=======================채팅방 나감========================');
      // client.close(1000, 'Work complete');
    };
  }, [moimId, userInfo]);

  const sendEmoji = () => {
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
      />
      {/* 채팅 */}
      {showChatArea ? (
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
          selectedEmoji={selectedEmoji}
        />
      ) : (
        !startDraw && (
          <MessagePreviewContainer>
            <MessagePreview
              message={messages ? messages[0] : null}
              onPress={() => {
                setShowChatArea(true);
                setShowEmoji(false);
              }}
            />
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
              selectedEmoji={selectedEmoji}
            />
          </MessagePreviewContainer>
        )
      )}
    </View>
  );
}

export default Chatroom;
