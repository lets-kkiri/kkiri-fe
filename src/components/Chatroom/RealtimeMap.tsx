import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Alert, TouchableOpacity} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';

// Naver Map
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Marker, Polyline} from 'react-native-nmap';

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
import { Socket } from 'socket.io-client';

interface UserProps {
  type: string;
  content: Object;
  memberId: number;
  latitude: number;
  longitude: number;
  regDate: string;
}

const UserData = {
  type: '',
  content: {
    memberId: 0,
    longitude: 0,
    latitude: 0,
    regDate: '',
  },
};

interface PathProps {
  latitude: number;
  longitude: number;
}

interface Props {
  client: React.MutableRefObject<any>;
  users: UserProps[];
  roomId: number;
}

type LocateType = {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
};

function RealtimeMap() {
  const [myPosition, setMyPosition] = useState(UserData);
  const [startDraw, setStartDraw] = useState<boolean>(false);
  const [drawpoint, setDrawpoint] = useState<PathProps | null>(null);
  const [drawpath, setDrawpath] = useState<PathProps[]>([]);
  const [sendpath, setSendpath] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [sideModal, setSideModal] = useState<boolean>(false);
  const date = new Date();

  const dispatch = useAppDispatch();

  // 임시 목적지: 역삼 멀티캠퍼스
  const destination = {latitude: 37.501303, longitude: 127.039603};
  const moimId = 1;

  const socket = useSelector(
    (state: PersistedRootState) => state.sockets.socket,
  );

  // const newsock = new WebSocket('wss://k8a606.p.ssafy.io/ws/api');

  // 서버와 연결되면 실행될 콜백 함수
  useEffect(() => {
    if (socket !== undefined) {
      // socket 값을 이용한 처리
      const newSocket: WebSocket = JSON.parse(socket);
      newSocket.onopen = () => {
        console.log('connected to server');
        Geolocation.watchPosition(
          position => {
            setMyPosition({
              type: 'GPS',
              content: {
                memberId: 1, // 임시
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                regDate: date.toISOString(),
              },
            });
          },
          error => console.log(error),
          {
            enableHighAccuracy: true,
            timeout: 20000,
          },
        );
      };
    }
  }, [socket]);

  // 두 위치의 거리 계산 함수
  function calculateDistance({lat1, lon1, lat2, lon2}: LocateType) {
    const R = 6371e3; // 지구 반경 (m)
    const cal1 = toRadians(lat1);
    const cal2 = toRadians(lat2);
    const cal3 = toRadians(lat2 - lat1);
    const cal4 = toRadians(lon2 - lon1);

    const a =
      Math.sin(cal3 / 2) * Math.sin(cal3 / 2) +
      Math.cos(cal1) * Math.cos(cal2) * Math.sin(cal4 / 2) * Math.sin(cal4 / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // 두 지점 사이의 거리 (m)

    return distance;
  }

  function toRadians(degrees: any) {
    return (degrees * Math.PI) / 180;
  }

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
      // Alert.alert('목적지에 도착하였습니다!', arriveTime);
      dispatch(arrivePost({moimId: moimId, arrivalTime: arrivalTime}));
      setModalVisible(true);
      setModalType('arrive');
    }
  }

  // 내 위치 서버로 보내기 -> websocket 로직으로 변경하기
  // socket.emit('sendMyLocate', JSON.stringify(myPosition));

  // const userGrades = useSelector(userGrade);
  // const userGrades = useSelector(
  //   (state: PersistedRootState) => state.arrives.userGrade,
  // );

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
      senderEmail: 'rlawnsgh8395@naver.com',
      receiverEmail: 'rlawnsgh8395@gmail.com',
      path: drawpath,
    };
    dispatch(guidesPost(postData));
    // setSendpath(true);
    // Alert.alert('길안내 알림을 전송했어요!');
    setModalVisible(true);
    setModalType('sendpath');
    setSendpath(false);
    setStartDraw(false);
  }

  // 재촉 보내는 함수
  function sendPress() {
    Alert.alert('재촉했어요!');
    // 임시 데이터
    const postData = {
      senderEmail: '지니',
      receiverEmail: 'rlawnsgh8395@gmail.com',
    };
    dispatch(pressPost(postData));
  }

  // 도움 요청 보내는 함수
  function sendHelp() {
    // Alert.alert('도움 요청을 보냈어요!');
    setModalVisible(true);
    setModalType('sendhelp');
    // 임시 데이터
    const postData = {
      senderEmail: 'rlawnsgh8395@naver.com',
      chatRoomId: 6,
    };
    dispatch(helpPost(postData));
  }

  return (
    <View>
      {myPosition && (
        <NaverMapView
          style={{width: '100%', height: '100%'}}
          onMapClick={e => {
            drawPath(e);
          }}
          center={{...myPosition.content, zoom: 14}}>
          {/* 임시 목적지 역삼 멀티캠퍼스 */}
          <Marker
            coordinate={destination}
            image={require('../../assets/icons/destination.png')}
            width={50}
            height={55}
          />
          {/* 반경 n미터 원으로 표시
          <Circle
            coordinate={destination}
            color={'rgba(221, 226, 252, 0.5)'}
            radius={50}
          /> */}
          {myPosition?.content.latitude && (
            <Marker
              coordinate={{
                latitude: myPosition.content.latitude,
                longitude: myPosition.content.longitude,
              }}
              image={require('../../assets/icons/bear.png')}
              width={45}
              height={50}
            />
          )}
          {/* {users.map(user => (
            <Marker
              onClick={sendPress}
              key={user.id}
              coordinate={{
                latitude: user.latitude,
                longitude: user.longitude,
              }}
              image={require('../../assets/icons/bear.png')}
              // caption={{text: user.id}}
            />
          ))} */}
          {drawpath.length > 1 ? (
            <Polyline
              coordinates={drawpath}
              strokeColor="#B0BDFF"
              strokeWidth={5}
            />
          ) : null}
        </NaverMapView>
      )}
      {startDraw === false ? (
        <NotiBox
          mainTitle="@친구가 도움을 요청했어요"
          subTitle="길을 헤매는 친구에게 길 안내를 보내주세요!"
          onPress={() => setStartDraw(true)}
        />
      ) : sendpath === false ? (
        <View style={{position: 'absolute', alignItems: 'center'}}>
          <View style={styles.drawnoti}>
            <WithLocalSvg asset={Pencil} width={16} height={18} />
            <Text>손가락으로 길을 그려 친구에게 보내주세요!</Text>
          </View>
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
      <CustomModal
        modalVisible={modalVisible}
        content={
          modalType === 'arrive' ? (
            <ArriveNoti setModalVisible={setModalVisible} />
          ) : modalType === 'sendpath' ? (
            <SendPathNoti setModalVisible={setModalVisible} />
          ) : (
            <SendHelpNoti setModalVisible={setModalVisible} />
          )
        }
      />
      {sideModal ? <AboutMoim setSideModal={setSideModal} /> : null}
      {/* 등수 보여주는 예시 */}
      {/* {userGrades ? (
        <View>
          <Text>{userGrades.ranking.overall}명 중에</Text>
          <Text>{userGrades.ranking.rank}등으로 도착하셨습니다!</Text>
        </View>
      ) : null} */}
    </View>
  );
}

const styles = StyleSheet.create({
  font: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  drawnoti: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 50,
    width: '90%',
    borderStyle: 'solid',
    borderColor: '#5968F2',
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 15,
  },
});

export default RealtimeMap;
