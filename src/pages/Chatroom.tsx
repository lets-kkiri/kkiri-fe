import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import {TextEncoder} from 'text-encoding';
import SockJS from 'sockjs-client';
import io from 'socket.io-client';
import {useSelector} from 'react-redux';
import EmojiBtn from '../components/Chatroom/EmojiBtn';
import {RouteProp} from '@react-navigation/native';

// API
import {requests} from '../api/requests';
import {authInstance, baseInstance} from '../api/axios';

// Components
import ChatArea from '../components/Chatroom/ChatArea';
import RealtimeMap from '../components/Chatroom/RealtimeMap';
import MessagePreview from '../components/Chatroom/MessagePreview';

// types
import {MessageData} from '../types/index';

// Redux
import {RootState} from '../store/reducer';

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
  const [emojiSelected, setEmojiSelected] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');

  // socket 저장하는 변수
  const client = useRef<WebSocket | null>(null);

  const encoder = new TextEncoder();

  // 채팅방 id
  const moimId = route.params.moimId;

  // 나 자신
  const myId = useSelector((state: RootState) => state.persisted.user.id);

  // 임시 토큰
  const accessToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyNzg1NTI5NzA1IiwiaXNzIjoiS0tJUkkiLCJleHAiOjE2ODM5NTk1MDEsImlhdCI6MTY4Mzg3MzEwMX0.BAuff1KtXDdU_nAPLC1trZvmMlW_IbSf7B9BPSI8Uq7D-DF-FtC5v-B5ilADtsY8tPSuqo08_0AkbO3kaiTemA';

  // console.log('은지의 토큰 :', accessToken);

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
              kakaoId: myId,
            },
          }),
        );
      };
    }

    if (client.current) {
      console.log('안녕');
      // 메시지 수신 이벤트
      client.current.onmessage = event => {
        const data = JSON.parse(event.data);
        // 채팅 메시지인 경우
        if (data.messageType === 'MESSAGE') {
          let newMessages = [data];
          setMessages(prev => [...newMessages, ...prev]);
        }

        // 이모티콘인 경우
        if (event.data.messageType === 'EMOJI') {
          // setMessages(prev => [...prev, event.data]);
        }

        // 재촉인 경우
        if (event.data.messageType === 'URGENT') {
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
    };
  }, [moimId]);

  const sendEmoji = () => {};

  const pushNewMessage = message => {};

  return (
    <View style={{flex: 1, position: 'relative'}}>
      {/* 지도 */}
      <RealtimeMap startDraw={startDraw} setStartDraw={setStartDraw} />
      {/* 채팅 */}
      {showChatArea ? (
        <ChatArea
          messages={messages}
          pushNewMessage={pushNewMessage}
          client={client}
          moimId={moimId}
          closeHandler={() => setShowChatArea(false)}
          onPress={emojiSelected ? sendEmoji : () => setShowEmoji(true)}
        />
      ) : (
        !startDraw && (
          <MessagePreviewContainer>
            <MessagePreview
              message={messages[0]}
              onPress={() => setShowChatArea(true)}
            />
            <EmojiBtn
              onPress={emojiSelected ? sendEmoji : () => setShowEmoji(true)}
            />
          </MessagePreviewContainer>
        )
      )}
    </View>
  );
}

export default Chatroom;
