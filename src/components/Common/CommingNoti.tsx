import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../../store';
import NotiBox from './NotiBox';
import notiSlice from '../../slices/noti';
import {RootStackParamList} from '../../types';
import {StackNavigationProp} from '@react-navigation/stack';

interface ChatProps {
  navigation: StackNavigationProp<RootStackParamList, 'Chatroom'>;
  setNewSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
}

const CommingNoti = ({navigation, setNewSocket}: ChatProps) => {
  const myId = useSelector((state: RootState) => state.persisted.user.id);
  const notices = useSelector((state: RootState) => state.persisted.noti);
  // const [newSocket, setNewSocket] = useState<WebSocket | null>(null);

  const dispatch = useAppDispatch();

  return (
    <NotiBox
      nickname=""
      mainTitle="모임이 1시간 남았어요."
      subTitle="실시간으로 친구들의 위치를 확인해 보세요!"
      onPress={() => {
        const socket = new WebSocket(
          `wss://k8a606.p.ssafy.io/ws/api/${notices[0].data.moimId}`,
        );
        socket.onopen = () => {
          console.log('연결!');
          // 소켓 열고 유저 정보 보내기
          socket?.send(
            JSON.stringify({
              type: 'JOIN',
              content: {
                kakaoId: myId,
              },
            }),
          );
        };
        if (socket) {
          setNewSocket(socket);
        }
        navigation.navigate('Chatroom', {
          moimId: notices[0].data.moimId,
        });
        dispatch(notiSlice.actions.clickNoti(notices[0].id));
      }}
    />
  );
};

export default CommingNoti;
