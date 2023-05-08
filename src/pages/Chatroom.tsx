import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableHighlight,
  Text,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {io, Socket} from 'socket.io-client';
import styled from 'styled-components/native';
import {TextEncoder} from 'text-encoding';
import * as SockJS from 'sockjs-client';
import StompJs from '@stomp/stompjs';

// API
import {requests} from '../api/requests';

// Components
import ChatFlatList from '../components/Chatroom/ChatFlatList';
import ChatArea from '../components/Chatroom/ChatArea';
import RealtimeMap from '../components/Chatroom/RealtimeMap';
import MessagePreview from '../components/Chatroom/MessagePreview';

// Styles
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 99,
  },
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});

// types
import {MessageData} from '../types/index';
import {request} from 'react-native-permissions';
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
const ChatroomPage = styled.View`
  position: relative;
`;

const MessagePreviewContainer = styled.View`
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

function Chatroom({route}: ChatroomProp) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [myPosition, setMyPosition] = useState<UserProps | null>(null);
  const [showChatArea, setShowChatArea] = useState<boolean>(true);
  const client = useRef<any>({});

  const encoder = new TextEncoder();

  // 채팅방 id
  const roomId = route.params.roomId;
  console.log('roomId :', roomId);

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: 'ws://k8a606.p.ssafy.io:8080/stomp', // 웹소켓 서버로 직접 접속
      // webSocketFactory: () => new SockJS(requests.base_url + requests.CONNECT),
      debug: function (str) {
        console.log('debug :', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
    });

    if (typeof WebSocket !== 'function') {
      client.current.options.webSocketFactory = function () {
        return new SockJS('http://k8a606.p.ssafy.io:8080/stomp', {
          // headers: {
          //   Host: 'k8a606.p.ssafy.io:8080',
          //   Connection: 'Upgrade',
          //   Upgrade: 'websocket',
          // },
        });
      };
    }

    client.current.onConnect = function (frame) {
      console.log('connect success!');
      console.log(frame);
      // 메시지 발신
      client.current.publish({
        destination: requests.CHAT(roomId),
        body: JSON.stringify({
          message: 'Hello World',
        }),
      });
    };

    client.current.onStompError = function (frame) {
      console.log('Broker reported error: ' + frame.headers['message']);
      console.log('Additional details: ' + frame.body);
    };

    client.current.activate();
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

  // 채팅메시지 발신
  // const sendMessage = () => {
  //   // console.log('client check :', client.current);
  //   client.current.publish({
  //     destination: requests.CHAT(roomId),
  //     body: JSON.stringify({
  //       message: 'Hello World',
  //     }),
  //   });
  //   // setInputValue('');
  // };

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
    ]);
  }, []);

  // 채팅방 입장시 연결
  useEffect(() => {
    console.log('start connect');
    connect();

    return () => {
      console.log('end connect');
      disconnect();
    };
  }, []);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <View style={{flex: 1}}>
        {/* 지도 */}
        <RealtimeMap />
        {/* 채팅 */}
        {showChatArea ? (
          <ChatArea data={messages} client={client} roomId={roomId} />
        ) : (
          <MessagePreviewContainer>
            <MessagePreview message={messages[messages.length - 1]} />
            <EmojiBtn />
          </MessagePreviewContainer>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default Chatroom;
