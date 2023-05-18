import React, {useEffect, useRef, useState} from 'react';
import {View, Alert, Text} from 'react-native';
import * as Animatable from 'react-native-animatable';

// Naver Map
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Marker, Polyline, Circle} from 'react-native-nmap';

// redux
import {useSelector} from 'react-redux';
import {useAppDispatch} from '../../store';
import {PersistedRootState, RootState} from '../../store/reducer';
import arriveSlice, {arrivePost} from '../../slices/arriveSlice';
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
import EncryptedStorage from 'react-native-encrypted-storage';
import GradeNoti from '../Map/GradeNoti';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Image} from 'react-native';
import styled from 'styled-components/native';

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
  myEmojiMessages: number[];
  myEmojiMessages: number[];
}

const HeaderContainer = styled.View`
  flex-direction: column;
  padding: 24px;
  width: 100%;
`;

function RealtimeMap({
  startDraw,
  setStartDraw,
  moimId,
  users,
  socket,
  emojiMessages,
  myEmojiMessages,
}: MapProps) {
  const [myPosition, setMyPosition] = useState<UserState | null>(null);
  // const [startDraw, setStartDraw] = useState<boolean>(false);
  const [drawpoint, setDrawpoint] = useState<PathState | null>(null);
  const [drawpath, setDrawpath] = useState<PathState[]>([]);
  const [sendpath, setSendpath] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const date = new Date();

  const dispatch = useAppDispatch();

  // 임시 목적지: 역삼 멀티캠퍼스
  const destination = {latitude: 37.501303, longitude: 127.039603};

  const userGrades = useSelector((state: RootState) => state.persisted.arrives);
  const user = useSelector((state: RootState) => state.persisted.user);
  const checkTime = async (position: any) => {
    // 두 위치의 거리 계산 함수
    const calculateDistance = ({lat1, lon1, lat2, lon2}: LocateState) => {
      const R = 6371e3; // 지구 반경 (m)
      const cal1 = toRadians(lat1);
      const cal2 = toRadians(lat2);
      const cal3 = toRadians(lat2 - lat1);
      const cal4 = toRadians(lon2 - lon1);

      const a =
        Math.sin(cal3 / 2) * Math.sin(cal3 / 2) +
        Math.cos(cal1) *
          Math.cos(cal2) *
          Math.sin(cal4 / 2) *
          Math.sin(cal4 / 2);
      Math.cos(cal1) * Math.cos(cal2) * Math.sin(cal4 / 2) * Math.sin(cal4 / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c; // 두 지점 사이의 거리 (m)

      return distance;
    };

    const toRadians = (degrees: any) => {
      return (degrees * Math.PI) / 180;
    };

    const distance = calculateDistance({
      lat1: position.coords.latitude,
      lon1: position.coords.longitude,
      lat2: 37.501303,
      lon2: 127.039603,
    });

    // 거리가 50m 이내인 경우 목적지에 도착했다고 알림
    if (distance <= 100) {
      const type = {
        moimId: moimId,
        isArrive: true,
      };
      const moimList = [
        {
          moimId: 0,
          isArrive: true,
        },
      ];
      const updatemoimList = [...moimList, type];
      const moims = JSON.stringify(updatemoimList);
      await EncryptedStorage.setItem('isArrive', moims);
      const getItem = await EncryptedStorage.getItem('isArrive');
      if (getItem !== null) {
        const check = JSON.parse(getItem);
        const isCheck = check.some((item: any) => item.moimId === moimId);
        if (isCheck === false) {
          const destinationTime = date.toISOString();
          dispatch(
            arrivePost({
              moimId: moimId,
              destinationTime: destinationTime,
            }),
          );
          setModalVisible(true);
          console.log('이즈 췤 첫번째');
        } else {
          console.log('이즈 췤 두번째');
          setModalVisible(false);
        }
      } else {
        console.log('이즈 췤 3번째');
        const destinationTime = date.toISOString();
        dispatch(
          arrivePost({
            moimId: moimId,
            destinationTime: destinationTime,
          }),
        );
        setModalVisible(true);
      }
    }
  };

  const sendLocation = (position: any) => {
    // 위치 업데이트 처리 로직
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
    checkTime(position);
  };

  // 컴포넌트가 마운트되었을 때 최초로 함수를 실행
  let watchID: any = useRef(null);
  useEffect(() => {
    if (watchID === null) {
      watchID.current = Geolocation.getCurrentPosition(
        sendLocation,
        error => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
        },
      );
    } else {
      watchID.current = Geolocation.watchPosition(
        sendLocation,
        error => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          distanceFilter: 5,
        },
      );
    }

    // 컴포넌트 마운트 시 위치 업데이트 시작
    // startWatchingLocation();
    // checks();

    return () => {
      if (watchID.current !== null) {
        Geolocation.clearWatch(watchID.current);
      }
    };
  }, []);

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

  console.log('');

  // 재촉 보내는 함수
  const sendPress = (kakaoId: string) => {
    if (!startDraw) {
      Alert.alert('재촉했어요!');
      // 임시 데이터
      const postData = {
        chatRoomId: moimId,
        receiverKakaoId: kakaoId,
      };
      dispatch(pressPost(postData));
    }
  };

  const notices = useSelector((state: RootState) => state.persisted.noti);

  return (
    <View style={{position: 'absolute', width: '100%', height: '100%'}}>
      {myPosition ? (
        <NaverMapView
          style={{width: '100%', height: '100%'}}
          onMapClick={e => {
            drawPath(e);
          }}
          center={{
            latitude: myPosition.content.latitude,
            longitude: myPosition.content.longitude,
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

          {myPosition?.content.latitude ? (
            <Marker
              coordinate={{
                latitude: myPosition.content.latitude,
                longitude: myPosition.content.longitude,
              }}
              // image={require('../../assets/icons/bear.png')}
              width={60}
              height={200}>
              {myEmojiMessages.length
                ? myEmojiMessages.map((emoji, index) => (
                    <EmojiAnimation index={String(emoji)} key={index} />
                  ))
                : null}
              <Image
                source={require('../../assets/icons/bear.png')}
                style={{position: 'absolute', bottom: 0}}
              />
            </Marker>
          ) : null}
          {users &&
            Object.entries(users).map(([kakaoId, data], index) => (
              <Marker
                onClick={() => sendPress(kakaoId)}
                key={kakaoId}
                coordinate={{
                  latitude: data.latitude,
                  longitude: data.longitude,
                }}
                width={60}
                height={200}>
                {Object.keys(emojiMessages).includes(kakaoId)
                  ? emojiMessages[kakaoId].map((emoji, index) => (
                      <EmojiAnimation index={emoji.message} key={emoji.seq} />
                    ))
                  : null}
                <Image
                  source={require('../../assets/icons/cat.png')}
                  style={{position: 'absolute', bottom: 0}}
                />
              </Marker>
              // </View>
            ))}
          {drawpath.length > 1 ? (
            <Polyline
              coordinates={drawpath}
              strokeColor="#B0BDFF"
              strokeWidth={5}
            />
          ) : null}
        </NaverMapView>
      ) : null}
      <View style={{marginLeft: 20, marginTop: 15, position: 'absolute'}}>
        <Animatable.View
          animation="slideInDown"
          iterationCount={1}
          direction="alternate">
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
            kakaoId={notices[0].data.kakaoId}
          />
        </Animatable.View>
      </View>
      {notices.length > 0 ? (
        notices[0].channelId === 'path' && notices[0].checked === false ? (
          <View style={{marginLeft: 20, marginTop: 15, position: 'absolute'}}>
            <Animatable.View
              animation="slideInDown"
              iterationCount={1}
              direction="alternate">
              <NotiBox
                nickname={notices[0].data.senderNickname}
                mainTitle="가 길 안내를 보냈어요!"
                subTitle="AR 길 안내를 확인하고 목적지로 이동해보세요!"
                onPress={() => {
                  // 여기 한별 네비게이트해
                  navigation.navigate('ARnavi');
                  dispatch(notiSlice.actions.clickNoti(notices[0]));
                }}
                type="map"
              />
            </Animatable.View>
          </View>
        ) : null
      ) : null}
      {notices.length > 0 ? (
        notices[0].channelId === 'sos' && notices[0].checked === false ? (
          <View style={{marginLeft: 20, marginTop: 15, position: 'absolute'}}>
            <Animatable.View
              animation="slideInDown"
              iterationCount={1}
              direction="alternate">
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
                kakaoId={notices[0].data.kakaoId}
              />
            </Animatable.View>
          </View>
        ) : null
      ) : null}
      <SideButton
        // setSideModal={setSideModal}
        setModalVisible={setModalVisible}
        setModalType={setModalType}
        moimId={moimId}
      />
      <CustomModal
        modalVisible={modalVisible}
        content={
          modalType === 'sendhelp' ? (
            <SendHelpNoti setModalVisible={setModalVisible} />
          ) : modalType === 'sendpath' ? (
            <SendPathNoti setModalVisible={setModalVisible} />
          ) : userGrades.length > 0 &&
            userGrades[0].overall !== userGrades[0].rank ? (
            <ArriveNoti
              setModalVisible={setModalVisible}
              overall={userGrades[0].overall}
              ranking={userGrades[0].rank}
            />
          ) : (
            <CustomModal
              modalVisible={modalVisible}
              content={<GradeNoti setModalVisible={setModalVisible} />}
            />
          )
        }
      />
    </View>
  );
}

export default RealtimeMap;
