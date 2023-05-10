import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import {TextEncoder} from 'text-encoding';
import {Client} from '@stomp/stompjs';
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

  const encoder = new TextEncoder();

  // 채팅방 id
  const roomId = route.params.roomId;
  console.log('roomId :', roomId);

  const start = () => {
    // const ws = new WebSocket('wss://k8a606.p.ssafy.io/stomp');
    // // const socket = new WebSocket('wss://k8a606.p.ssafy.io/stomp');
    // client.current = Stomp.over(socket);

    // client.current.connect({}, () => {
    //   console.log('Connected');
    //   client.current.send(
    //     requests.CHAT(roomId),
    //     {},
    //     JSON.stringify({message: 'hello'}),
    //   );
    // });

    // @stomp/stompjs
    // const socket = new SockJS('')
    client.current = new Client({
      brokerURL: 'ws://k8a606.p.ssafy.io:8080/stomp', // 웹소켓 서버로 직접 접속
      webSocketFactory: () => {
        return new SockJS('http://k8a606.p.ssafy.io:8080/stomp');
      },
      debug: function (str) {
        console.log('debug :', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
    });

    client.current.onConnect = function (frame) {
      // Do something, all subscribes must be done is this callback
      // This is needed because this will be executed after a (re)connect
      console.log('onConnect :', frame);
    };

    // client.current.onConnect({}, () => {
    //   console.log('connected');
    // });

    // client.current.send(
    //   `/pub/chat/message/${roomId}`,
    //   JSON.stringify({text: 'hello'}),
    // );

    // if (typeof WebSocket !== 'function') {
    //   client.current.options.webSocketFactory = function () {
    //     return new SockJS('https://k8a606.p.ssafy.io/stomp', {
    //       // headers: {
    //       //   Host: 'k8a606.p.ssafy.io:8080',
    //       //   Connection: 'Upgrade',
    //       //   Upgrade: 'websocket',
    //       // },
    //     });
    //   };
    // }

    client.current.activate();

    // client.current.publish({
    //   destination: `/pub/chat/message/${roomId}`,
    //   body: JSON.stringify({
    //     message: 'Hello World',
    //   }),
    // });
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  function onConnected() {
    console.log('connect success');
    // subscribeLocation();
    // sendLocation();r
    receiveMessage();
  }

  // 서버에서 다른 사용자들의 위치 받아오기
  const subscribeLocation = () => {
    client.current.subscribe(`/stomp/gps/location/${roomId}`, user => {
      setUsers(userLocate => [...userLocate, JSON.parse(user.body)]);
    });
  };

  // 내 위치 서버로 보내기
  const sendLocation = () => {
    client.current.send(
      `/stomp/gps/location/${roomId}`,
      {},
      JSON.stringify(myPosition),
    );
  };

  // 채팅메시지 수신
  const receiveMessage = () => {
    client.current.subscribe(
      requests.base_url + requests.CHAT(roomId),
      message => {
        setMessages(JSON.parse(message.body));
      },
    );
  };

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
      // disconnect();
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
    <View style={{flex: 1, position: 'relative'}}>
      {/* 지도 */}
      <RealtimeMap />
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
