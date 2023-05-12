import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import {TextEncoder} from 'text-encoding';
import SockJS from 'sockjs-client';
import io from 'socket.io-client';
import {useSelector} from 'react-redux';

// API
import {requests} from '../api/requests';

// Components
import ChatArea from '../components/Chatroom/ChatArea';
import RealtimeMap from '../components/Chatroom/RealtimeMap';
import MessagePreview from '../components/Chatroom/MessagePreview';

// types
import {MessageData} from '../types/index';
import EmojiBtn from '../components/Chatroom/EmojiBtn';
import {RootState} from '../store/reducer';

interface ChatroomProp {
  navigation: NativeStackNavigationProp<any>;
  route: any;
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
  const [users, setUsers] = useState<UserProps[]>([]);
  const [myPosition, setMyPosition] = useState<UserProps | null>(null);
  const [showChatArea, setShowChatArea] = useState<boolean>(false);
  const client = useRef<any>(null);

  // 채팅방 id
  const moimId = route.params.moimId;
  console.log('moimId :', moimId);

  // 해당 moimId에 대한 소켓
  const socket = useSelector((state: RootState) => state.socket.value); // 수정필요

  useEffect(() => {
    setMessages([
      {
        id: 0,
        userName: '은지',
        userImg:
          'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-176213403491/media/magazine_img/magazine_262/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg',
        text: '안녕',
        created: '2023.5.4',
      },
      {
        id: 1,
        userName: '은지',
        userImg:
          'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-176213403491/media/magazine_img/magazine_262/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg',
        text: '안녕',
        created: '2023.5.4',
      },
      {
        id: 2,
        userName: '은지',
        userImg:
          'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-176213403491/media/magazine_img/magazine_262/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg',
        text: '안녕',
        created: '2023.5.4',
      },
      {
        id: 3,
        userName: '은지',
        userImg:
          'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-176213403491/media/magazine_img/magazine_262/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg',
        text: '안녕',
        created: '2023.5.4',
      },
      {
        id: 4,
        userName: '은지',
        userImg:
          'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-176213403491/media/magazine_img/magazine_262/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg',
        text: '안녕',
        created: '2023.5.4',
      },
      {
        id: 5,
        userName: '은지',
        userImg:
          'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-176213403491/media/magazine_img/magazine_262/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg',
        text: '안녕',
        created: '2023.5.4',
      },
      {
        id: 6,
        userName: '은지',
        userImg:
          'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-176213403491/media/magazine_img/magazine_262/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg',
        text: '안녕',
        created: '2023.5.4',
      },
      {
        id: 7,
        userName: '은지',
        userImg:
          'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-176213403491/media/magazine_img/magazine_262/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg',
        text: '안녕',
        created: '2023.5.4',
      },
      {
        id: 8,
        userName: '은지',
        userImg:
          'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-176213403491/media/magazine_img/magazine_262/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg',
        text: '안녕',
        created: '2023.5.4',
      },
      {
        id: 9,
        userName: '은지',
        userImg:
          'https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-176213403491/media/magazine_img/magazine_262/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg',
        text: '안녕',
        created: '2023.5.4',
      },
    ]);
  }, []);

  useEffect(() => {}, []);

  // useEffect(() => {
  //   if (wsConnected) {
  //     client.current.send(
  //       JSON.stringify({
  //         messageType: 'ENTER',
  //         moimId: 1,
  //         memberId: 1,
  //         nickname: '일',
  //         message: '반갑다',
  //       }),
  //     );
  //   }
  // }, [wsConnected]);

  return (
    <View style={{flex: 1, position: 'relative'}}>
      {/* 지도 */}
      {/* <RealtimeMap /> */}
      {/* 채팅 */}
      {showChatArea ? (
        <ChatArea data={messages} client={client} roomId={roomId} />
      ) : (
        <MessagePreviewContainer>
          <MessagePreview
            message={messages[messages.length - 1]}
            onPress={() => setShowChatArea(true)}
          />
          <EmojiBtn />
        </MessagePreviewContainer>
      )}
    </View>
  );
}

export default Chatroom;
