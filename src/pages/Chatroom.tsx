import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import {TextEncoder} from 'text-encoding';
import SockJS from 'sockjs-client';
import io from 'socket.io-client';

// API
import {requests} from '../api/requests';

// Components
import ChatArea from '../components/Chatroom/ChatArea';
import RealtimeMap from '../components/Chatroom/RealtimeMap';
import MessagePreview from '../components/Chatroom/MessagePreview';

// types
import {MessageData} from '../types/index';
import EmojiBtn from '../components/Chatroom/EmojiBtn';

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

  const [startDraw, setStartDraw] = useState<boolean>(false);

  const encoder = new TextEncoder();

  // 채팅방 id
  const roomId = route.params.roomId;
  console.log('roomId :', roomId);

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

  // 채팅방 입장시 연결
  const [wsConnected, setWsConnected] = useState(false);
  useEffect(() => {
    console.log('start connect');
    // start();
    // client.current = io('http://k8a606.p.ssafy.io:8080/ws/api');
    if (!client.current) {
      console.log('here');
      client.current = new WebSocket('wss://k8a606.p.ssafy.io/ws/api');
      client.current.onopen = () => {
        console.log('ws connected');
        setWsConnected(true);
      };

      client.current.onclose = error => {
        console.log(error);
      };
    }

    return () => {
      console.log('end connect');
      client.current.close();
    };
  }, []);

  useEffect(() => {
    if (wsConnected) {
      client.current.send(
        JSON.stringify({
          messageType: 'ENTER',
          moimId: 1,
          memberId: 1,
          nickname: '일',
          message: '반갑다',
        }),
      );
    }
  }, [wsConnected]);

  return (
    <View style={{position: 'absolute', width: '100%', height: '100%'}}>
      {/* 지도 */}
      <RealtimeMap startDraw={startDraw} setStartDraw={setStartDraw} />
      {/* 채팅 */}
      {showChatArea ? (
        <ChatArea data={messages} client={client} roomId={roomId} />
      ) : (
        !startDraw && (
          <MessagePreviewContainer>
            <MessagePreview
              message={messages[messages.length - 1]}
              onPress={() => setShowChatArea(true)}
            />
            <EmojiBtn />
          </MessagePreviewContainer>
        )
      )}
    </View>
  );
}

export default Chatroom;
