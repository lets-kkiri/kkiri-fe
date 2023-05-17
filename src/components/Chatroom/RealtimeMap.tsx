import React, {useEffect, useState} from 'react';
import {View, Alert, Text} from 'react-native';

// Naver Map
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Marker, Polyline, Circle} from 'react-native-nmap';

// redux
import {useSelector} from 'react-redux';
import {useAppDispatch} from '../../store';
import {PersistedRootState, RootState} from '../../store/reducer';
import {arrivePost} from '../../slices/arriveSlice';
import {pressPost} from '../../slices/pressSlice';

// component
import AboutMoim from '../Map/AboutMoim';
import ArriveNoti from '../Map/ArriveNoti';
import SendPathNoti from '../Map/SendPathNoti';
import SendHelpNoti from '../Map/SendHelpNoti';
import CustomModal from '../Common/Modal';

// svg
import AboutPath from '../Map/AboutPath';
import SideButton from '../Map/SideButton';
import NotiBox from '../Common/NotiBox';
import notiSlice from '../../slices/noti';
import EmojiAnimation from '../EmojiAnimation/EmojiAnimation';
import {MessageData} from '../../types';

interface UserState {
  type: string;
  content: {
    latitude: number;
    longitude: number;
    regDate: string;
  };
}

interface PathState {
  latitude: number;
  longitude: number;
}

interface LocateState {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
}

interface UserType {
  longitude: number;
  latitude: number;
}

type UsersType = {
  [key: number]: UserType;
};

interface MapProps {
  startDraw: boolean;
  setStartDraw: React.Dispatch<React.SetStateAction<boolean>>;
  moimId: number;
  users: UsersType | null;
  socket: any;
  emojiMessages: {
    [key: number]: MessageData[];
  };
}

function RealtimeMap({
  startDraw,
  setStartDraw,
  moimId,
  users,
  socket,
  emojiMessages,
}: MapProps) {
  const [myPosition, setMyPosition] = useState<UserState | null>(null);
  // const [startDraw, setStartDraw] = useState<boolean>(false);
  const [drawpoint, setDrawpoint] = useState<PathState | null>(null);
  const [drawpath, setDrawpath] = useState<PathState[]>([]);
  const [sendpath, setSendpath] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [sideModal, setSideModal] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [sendArrive, setSendArrive] = useState<boolean>(false);
  const date = new Date();

  const dispatch = useAppDispatch();

  // 임시 목적지: 역삼 멀티캠퍼스
  const destination = {latitude: 37.501303, longitude: 127.039603};

  function sendLocation() {
    console.log('실시간 위치 공유 시작');
    Geolocation.watchPosition(
      position => {
        const data = {
          type: 'GPS',
          content: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            regDate: date.toISOString(),
          },
        };
        socket.current.send(JSON.stringify(data));
        console.log('서버로 내 위치 보내기');
        setMyPosition(data);

        // 현재 위치와 목적지 위치의 거리 계산
        const distance = calculateDistance({
          lat1: position.coords.latitude,
          lon1: position.coords.longitude,
          lat2: 37.501303,
          lon2: 127.039603,
        });

        // 거리가 50m 이내인 경우 목적지에 도착했다고 알림
        // if (distance <= 50 && !sendArrive) {
        //   console.log('목적지 도착');
        //   const destinationTime = date.toISOString();
        //   dispatch(
        //     arrivePost({
        //       moimId: moimId,
        //       destinationTime: destinationTime,
        //     }),
        //   );
        //   setSendArrive(true);
        //   setModalVisible(true);
        //   setModalType('arrive');
        // }
        // 재귀적으로 자기 자신을 호출하여 일정 시간 후에 함수를 다시 실행
        // timerId = setTimeout(sendLocation, 30000);
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        distanceFilter: 5,
      },
    );
  }

  // 컴포넌트가 마운트되었을 때 최초로 함수를 실행
  useEffect(() => {
    // sendLocation();
    setMyPosition({
      type: 'GPS',
      content: {
        latitude: 37.501303,
        longitude: 127.039603,
        regDate: date.toISOString(),
      },
    });
    // 컴포넌트가 언마운트될 때 clearTimeout을 사용하여 타이머를 정리해주는 것이 좋습니다.
    return () => {};
  }, []);

  // 두 위치의 거리 계산 함수
  const calculateDistance = ({lat1, lon1, lat2, lon2}: LocateState) => {
    const R = 6371e3; // 지구 반경 (m)
    const cal1 = toRadians(lat1);
    const cal2 = toRadians(lat2);
    const cal3 = toRadians(lat2 - lat1);
    const cal4 = toRadians(lon2 - lon1);

    const a =
      Math.sin(cal3 / 2) * Math.sin(cal3 / 2) +
      Math.cos(cal1) * Math.cos(cal2) * Math.sin(cal4 / 2) * Math.sin(cal4 / 2);
    Math.cos(cal1) * Math.cos(cal2) * Math.sin(cal4 / 2) * Math.sin(cal4 / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // 두 지점 사이의 거리 (m)

    return distance;
  };

  const toRadians = (degrees: any) => {
    return (degrees * Math.PI) / 180;
  };

  const userGrades = useSelector(
    (state: RootState) => state.persisted.arrives.userGrade,
  );

  const drawPath = (e: any) => {
    if (startDraw) {
      setDrawpoint({
        latitude: e.latitude,
        longitude: e.longitude,
      });
    } else {
      return;
    }
  };

  // 재촉 보내는 함수
  const sendPress = (kakaoId: string) => {
    if (!startDraw) {
      Alert.alert('재촉했어요!');
      setCount(count + 1);
      // 임시 데이터
      const postData = {
        chatRoomId: moimId,
        receiverKakaoId: kakaoId,
      };
      dispatch(pressPost(postData));
    }
  };

  const notices = useSelector((state: RootState) => state.persisted.noti);
  // console.log('노티노티 : ', notices);
  const userInfo = useSelector((state: RootState) => state.persisted.user);
  // console.log('my id :', userInfo.id);
  console.log('emojiMessages :', emojiMessages);

  return (
    <View style={{position: 'absolute', width: '100%', height: '100%'}}>
      {myPosition ? (
        <NaverMapView
          style={{width: '100%', height: '100%'}}
          onMapClick={e => {
            drawPath(e);
          }}
          center={{
            latitude: 37.501303,
            longitude: 127.039603,
          }}>
          {/* 임시 목적지 역삼 멀티캠퍼스 */}
          <Marker
            coordinate={destination}
            image={require('../../assets/icons/destination.png')}
            width={30}
            height={35}
          />
          {/* 반경 n미터 원으로 표시 */}
          {!startDraw && (
            <Circle
              coordinate={destination}
              color={'rgba(221, 226, 252, 0.5)'}
              radius={50}
            />
          )}

          {Object.keys(emojiMessages).includes(userInfo.id) &&
            emojiMessages[userInfo.id].map(emoji => (
              <EmojiAnimation index={emoji.message} key={emoji.seq} />
            ))}
          <Marker
            coordinate={{
              latitude: 37.501303,
              longitude: 127.039603,
            }}
            image={require('../../assets/icons/bear.png')}
            width={45}
            height={50}
          />

          {users &&
            Object.entries(users).map(([kakaoId, data], index) => (
              <View>
                <EmojiAnimation index={'0'} />
                <Marker
                  onClick={() => sendPress(kakaoId)}
                  key={index}
                  coordinate={{
                    latitude: data.latitude,
                    longitude: data.longitude,
                  }}
                  image={require('../../assets/icons/cat.png')}
                  width={45}
                  height={50}
                />
              </View>
            ))}
          {drawpath.length > 1 ? (
            <Polyline
              coordinates={drawpath}
              strokeColor="#B0BDFF"
              strokeWidth={5}
            />
          ) : null}
          {notices.length > 0 ? (
            notices[0].channelId === 'path' && !notices[0].checked ? (
              <NotiBox
                nickname={notices[0].data.senderNickname}
                mainTitle="가 길 안내를 보냈어요!"
                subTitle="AR 길 안내를 확인하고 목적지로 이동해보세요!"
                onPress={() =>
                  dispatch(notiSlice.actions.clickNoti(notices[0]))
                }
              />
            ) : (
              <Polyline
                coordinates={notices[0].data.path}
                strokeColor="#B0BDFF"
                strokeWidth={5}
              />
            )
          ) : null}
        </NaverMapView>
      ) : null}
      {/* {notices.length > 0 ? (
        notices[0].channelId === 'sos' && !notices[0].checked ? (
          <AboutPath
            startDraw={startDraw}
            setStartDraw={setStartDraw}
            sendpath={sendpath}
            setModalVisible={setModalVisible}
            setModalType={setModalType}
            setSendpath={setSendpath}
            drawpoint={drawpoint}
            setDrawpoint={setDrawpoint}
            drawpath={drawpath}
            setDrawpath={setDrawpath}
            nickname={notices[0].data.senderNickname}
            noti={notices[0]}
          />
        ) : null
      ) : null} */}
      <SideButton
        // setSideModal={setSideModal}
        setModalVisible={setModalVisible}
        setModalType={setModalType}
        moimId={moimId}
      />
      {userGrades.ranking.overall !== 0 ? (
        <CustomModal
          modalVisible={modalVisible}
          content={
            modalType === 'arrive' ? (
              <ArriveNoti
                setModalVisible={setModalVisible}
                overall={userGrades.ranking.overall}
                ranking={userGrades.ranking.rank}
              />
            ) : modalType === 'sendpath' ? (
              <SendPathNoti setModalVisible={setModalVisible} />
            ) : (
              <SendHelpNoti setModalVisible={setModalVisible} />
            )
          }
        />
      ) : null}
      {sideModal ? (
        <AboutMoim setSideModal={setSideModal} count={count} />
      ) : null}
    </View>
  );
}

export default RealtimeMap;
