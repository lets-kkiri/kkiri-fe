import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import EmojiBtn from '../components/Chatroom/EmojiBtn';
import {RouteProp} from '@react-navigation/native';

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

import {emojis} from '../assets/emoji/emojis';

interface ChatroomProp {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Chatroom'>;
  route: RouteProp<RootStackParamList, 'Chatroom'>;
}

interface UserProps {
  id: number;
  roomId: number;
  memberId: number;
  latitude: number;
  longitude: number;
  regDate: string;
}

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
  const [theTimerId, setTheTimerId] = useState<null | number>(null);

  // socket 저장하는 변수
  const client = useRef<WebSocket | null>(null);

  // 채팅방 id
  const moimId = route.params.moimId;
  // 나 자신
  const userInfo = useSelector((state: RootState) => state.persisted.user);

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

    // WebSocket;
    if (!client.current) {
      client.current = new WebSocket(
        `wss://k8a606.p.ssafy.io/ws/api/${moimId}`,
      );

      client.current.onopen = () => {
        console.log('연결!');
        // 소켓 열고 유저 정보 보내기
        client.current?.send(
          JSON.stringify({
            type: 'JOIN',
            content: {
              kakaoId: userInfo.id,
            },
          }),
        );
      };
    }

    if (client.current) {
      // 메시지 수신 이벤트
      client.current.onmessage = event => {
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
      };

      client.current.onerror = e => {
        console.log('socket error :', e);
      };

      client.current.onclose = e => {
        console.log('socket close :', e.code, e.reason);
      };
    }
    return () => {
      console.log('=======================채팅방 나감========================');
      client.current?.close();
    };
  }, [moimId, userInfo]);

  const sendEmoji = () => {
    if (client.current) {
      console.log('send emoji :', selectedEmoji);
      client.current?.send(
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
    }
  };
  // console.log('showEmoji', showEmoji);

  const onSelect = (emoji: any) => {
    setIsEmojiSelected(true);
    setSelectedEmoji(emoji);

    if (theTimerId) {
      clearTimeout(theTimerId);
    }

    const timerId = setTimeout(() => {
      setIsEmojiSelected(false);
      setSelectedEmoji('');
      setTheTimerId(null);
      clearTimeout(timerId);
    }, 3000);
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
        client={client.current}
        moimId={moimId}
      />
      {/* 채팅 */}
      {showChatArea ? (
        <ChatArea
          messages={messages}
          client={client}
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
        />
      ) : (
        !startDraw && (
          <MessagePreviewContainer>
            <MessagePreview
              message={messages[0]}
              onPress={() => {
                setShowChatArea(true);
                setShowEmoji(false);
              }}
            />
            <EmojiBtn
              onPress={
                isEmojiSelected
                  ? () => sendEmoji()
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
