import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Alert, TouchableOpacity} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import styled from 'styled-components/native';

// Naver Map
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Marker, Polyline, Circle} from 'react-native-nmap';

// redux
import {useSelector} from 'react-redux';
import {useAppDispatch} from '../../store';
import {PersistedRootState, RootState} from '../../store/reducer';
import {guidesPost} from '../../slices/guidesSlice';
import {arrivePost} from '../../slices/arriveSlice';
import {pressPost} from '../../slices/pressSlice';
import {helpPost} from '../../slices/helpSlice';

// component
import AboutMoim from '../Map/AboutMoim';
import ArriveNoti from '../Map/ArriveNoti';
import SendPathNoti from '../Map/SendPathNoti';
import SendHelpNoti from '../Map/SendHelpNoti';
import CustomModal from '../Common/Modal';
import CustomButton from '../Common/Button';

// svg
import Pencil from '../../assets/icons/pencil.svg';
import Help from '../../assets/icons/help.svg';
import Info from '../../assets/icons/info.svg';
import NotiBox from '../Common/NotiBox';
import {Socket} from 'socket.io-client';
import {createSocket, socketConnect} from '../../slices/socket';

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
  type: string;
  content: {
    moimId: number;
    kakaoId: number;
    longitude: number;
    latitude: number;
    pubTime: string;
  };
}

interface MapProps {
  startDraw: boolean;
  setStartDraw: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserData = {
  type: '',
  content: {
    moimId: 0,
    kakaoId: 0,
    longitude: 0,
    latitude: 0,
    pubTime: '',
  },
};

const DrawNoti = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  height: 50;
  width: 90%;
  border-style: solid;
  border-color: #5968f2;
  border-width: 1;
  border-radius: 15;
  margin-top: 15;
  padding-left: 20;
`;

function RealtimeMap({startDraw, setStartDraw}: MapProps) {
  const [myPosition, setMyPosition] = useState<UserState | null>({
    type: '',
    content: {
      longitude: 0,
      latitude: 0,
      regDate: '',
    },
  });
  // const [startDraw, setStartDraw] = useState<boolean>(false);
  const [drawpoint, setDrawpoint] = useState<PathState | null>(null);
  const [drawpath, setDrawpath] = useState<PathState[]>([]);
  const [sendpath, setSendpath] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [sideModal, setSideModal] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [user, setUser] = useState(UserData);
  const [users, setUsers] = useState<UserType[]>([UserData]);
  const date = new Date();

  const dispatch = useAppDispatch();

  // 임시 목적지: 역삼 멀티캠퍼스
  const destination = {latitude: 37.501303, longitude: 127.039603};
  const moimId = 1;

  useEffect(() => {
    Geolocation.watchPosition(
      position => {
        setMyPosition({
          type: 'GPS',
          content: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            regDate: date.toISOString(),
          },
        });
        // 내 위치 서버로 보내기 -> websocket 로직으로 변경하기
        // socket.send(JSON.stringify(myPosition));

        // 현재 위치와 목적지 위치의 거리 계산
        if (myPosition) {
          const distance = calculateDistance({
            lat1: myPosition.content.latitude,
            lon1: myPosition.content.longitude,
            lat2: 37.501303,
            lon2: 127.039603,
          });

          // 거리가 50m 이내인 경우 목적지에 도착했다고 알림
          if (distance <= 50) {
            console.log('목적지 도착');
            const arrivalTime = date.toISOString();
            dispatch(arrivePost({moimId: moimId, arrivalTime: arrivalTime}));
            setModalVisible(true);
            setModalType('arrive');
          }
        }
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    );

    // 임시 유저 데이터
    setUsers([
      {
        type: 'GPS',
        content: {
          moimId: 0,
          kakaoId: 0,
          longitude: 127.013373,
          latitude: 37.616743,
          pubTime: '',
        },
      },
      {
        type: 'GPS',
        content: {
          moimId: 0,
          kakaoId: 1,
          longitude: 127.078081,
          latitude: 37.513914,
          pubTime: '',
        },
      },
    ]);

    // 서버로부터 모임원들 위치 받아오기
    // socket.onmessage = function (event) {
    //   if (event.data.type === 'GPS') {
    //     setUser(event.data.content);
    //   }
    //   setUsers([...users, user]);
    // };

    // 두 위치의 거리 계산 함수
    function calculateDistance({lat1, lon1, lat2, lon2}: LocateState) {
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
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c; // 두 지점 사이의 거리 (m)

      return distance;
    }

    function toRadians(degrees: any) {
      return (degrees * Math.PI) / 180;
    }
  }, []);

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

  useEffect(() => {
    if (drawpoint) {
      setDrawpath(prevPoint => [...prevPoint, drawpoint]);
    }
  }, [drawpoint]);

  // 서버로 그린 경로 보내는 함수
  function sendPath() {
    // 임시 데이터
    const postData = {
      receiverKakaoId: 2783374648,
      path: drawpath,
    };
    dispatch(guidesPost(postData));
    setModalVisible(true);
    setModalType('sendpath');
    setSendpath(false);
    setStartDraw(false);
  }

  // 재촉 보내는 함수
  function sendPress() {
    if (!startDraw) {
      Alert.alert('재촉했어요!');
      setCount(count + 1);
      // 임시 데이터
      const postData = {
        receiverKakaoId: 2783374648,
      };
      dispatch(pressPost(postData));
    }
  }

  // 도움 요청 보내는 함수
  function sendHelp() {
    setModalVisible(true);
    setModalType('sendhelp');
    // 임시 데이터
    const postData = {
      chatRoomId: 6,
    };
    dispatch(helpPost(postData));
  }

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
              image={require('../../assets/icons/bear.png')}
              width={45}
              height={50}
              onClick={sendPress}
            />
          ) : null}
          {users.map(data => (
            <Marker
              onClick={sendPress}
              key={data.content.kakaoId}
              coordinate={{
                latitude: data.content.latitude,
                longitude: data.content.longitude,
              }}
              image={require('../../assets/icons/cat.png')}
              width={45}
              height={50}
              // caption={{text: user.id}}
            />
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
      {startDraw === false ? (
        <NotiBox
          mainTitle="@친구가 도움을 요청했어요"
          subTitle="길을 헤매는 친구에게 길 안내를 보내주세요!"
          onPress={() => setStartDraw(true)}
        />
      ) : sendpath === false ? (
        <View style={{position: 'absolute', alignItems: 'center'}}>
          <DrawNoti>
            <WithLocalSvg
              asset={Pencil}
              width={16}
              height={18}
              style={{marginRight: 10}}
            />
            <Text style={{color: '#5968F2', fontWeight: '600'}}>
              손가락으로 길을 그려 친구에게 보내주세요!
            </Text>
          </DrawNoti>
          <View
            style={{
              top: 580,
              left: 0,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <CustomButton
              text="다시 그리기"
              status="disabled"
              width="short"
              onPress={() => {
                setDrawpoint(null);
                setDrawpath([]);
              }}
            />
            <CustomButton
              text="경로 전송하기"
              status="active"
              width="short"
              onPress={() => {
                setDrawpoint(null);
                setDrawpath([]);
                sendPath();
                console.log(drawpath);
              }}
            />
          </View>
        </View>
      ) : null}
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 110,
          left: 350,
        }}
        onPress={sendHelp}>
        <WithLocalSvg asset={Help} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 160,
          left: 350,
        }}
        onPress={() => setSideModal(true)}>
        <WithLocalSvg asset={Info} />
      </TouchableOpacity>
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
