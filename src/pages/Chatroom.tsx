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

// types
import {MessageData, RootStackParamList} from '../types/index';

// Redux
import {RootState} from '../store';
import locationUpdater from '../hooks/useLocationUpdater';

interface ChatroomProp {
  // navigation: NativeStackNavigationProp<RootStackParamList, 'Chatroom'>;
  route: RouteProp<RootStackParamList, 'Chatroom'>;
  client: WebSocket | null;
}

interface UserType {
  type: string;
  content: {
    moimId: number;
    kakaoId: number;
    longitude: number;
    latitude: number;
    pubTime: string;
  };
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

function Chatroom({route, client}: ChatroomProp) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [showChatArea, setShowChatArea] = useState<boolean>(false);
  const [startDraw, setStartDraw] = useState<boolean>(false);
  const [emojiSelected, setEmojiSelected] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [user, setUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  // const [socket, SetSocket] = useState<WebSocket | null>(null);

  // 채팅방 id
  const moimId = route.params.moimId;
  // 나 자신
  const myId = useSelector((state: RootState) => state.persisted.user.id);

  // socket 저장하는 변수
  // const socket = locationUpdater({moimId: 9, myId: myId});
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

    // WebSocket;
    // if (!socket.current) {
    //   socket.current = new WebSocket(
    //     `wss://k8a606.p.ssafy.io/ws/api/${moimId}`,
    //   );

    //   socket.current.onopen = () => {
    //     console.log('연결!');
    //     // 소켓 열고 유저 정보 보내기
    //     socket.current?.send(
    //       JSON.stringify({
    //         type: 'JOIN',
    //         content: {
    //           kakaoId: myId,
    //         },
    //       }),
    //     );
    //   };
    // }

    if (socket.current) {
      console.log('연결연결');
      // 메시지 수신 이벤트
      socket.current.onmessage = event => {
        console.log(event.data);
        const data = JSON.parse(event.data);
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
          setUser(data.content);
        }

        if (user) {
          setUsers([...users, user]);
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
      // socket?.close();
    };
  }, [moimId, myId]);

  const sendEmoji = () => {};

  return (
    <View style={{position: 'absolute', width: '100%', height: '100%'}}>
      {/* 지도 */}
      <RealtimeMap
        startDraw={startDraw}
        setStartDraw={setStartDraw}
        moimId={moimId}
        users={users}
        socket={socket}
      />
      {/* 채팅 */}
      {showChatArea ? (
        <ChatArea
          messages={messages}
          client={socket}
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
