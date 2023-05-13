import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';

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
  client: any;
  moimId: number;
}

function RealtimeMap({startDraw, setStartDraw, client, moimId}: MapProps) {
  const [myPosition, setMyPosition] = useState<UserState | null>(null);
  // const [startDraw, setStartDraw] = useState<boolean>(false);
  const [drawpoint, setDrawpoint] = useState<PathState | null>(null);
  const [drawpath, setDrawpath] = useState<PathState[]>([]);
  const [sendpath, setSendpath] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [sideModal, setSideModal] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [user, setUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const date = new Date();

  const dispatch = useAppDispatch();

  // 임시 목적지: 역삼 멀티캠퍼스
  const destination = {latitude: 37.501303, longitude: 127.039603};

  setTimeout(() => {
    Geolocation.getCurrentPosition(
      position => {
        setMyPosition({
          type: 'GPS',
          content: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            regDate: date.toISOString(),
          },
        });

        // 현재 위치와 목적지 위치의 거리 계산
        if (myPosition) {
          // 내 위치 서버로 보내기 -> websocket 로직으로 변경하기
          if (client) {
            client.send(JSON.stringify(myPosition));
            console.log('내 위치 보낸다');
            // socket.send(JSON.stringify(myPosition));
          }

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

    // 서버로부터 모임원들 위치 받아오기
    if (client) {
      client.onmessage = function (event: any) {
        console.log('구성원들 위치 받아온다');
        const data = JSON.parse(event.data);
        if (data.type === 'GPS') {
          setUser(data.content);
        }

        if (user) {
          setUsers([...users, user]);
        }
      };
    }
  }, 10000);

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
  const sendPress = (kakaoId: number) => {
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
            />
          ) : null}
          {users?.map((data, index) => (
            <Marker
              onClick={() => sendPress(data.content.kakaoId)}
              key={index}
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
      />
      <SideButton
        setSideModal={setSideModal}
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
