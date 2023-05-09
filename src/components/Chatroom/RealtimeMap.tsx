import React, {useEffect, useState, MutableRefObject} from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Alert,
  Image,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Circle, Marker, Polyline} from 'react-native-nmap';
import {guidesPost} from '../../slices/guidesSlice';
import store from '../../store';
import {arrivePost, userGrade} from '../../slices/arriveSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducer';

interface UserProps {
  id: number;
  roomId: number;
  memberId: number;
  latitude: number;
  longitude: number;
}

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

function RealtimeMap({client, users, roomId}: Props) {
  const [myPosition, setMyPosition] = useState<UserProps | null>(null);
  const [startDraw, setStartDraw] = useState<boolean>(false);
  const [drawpoint, setDrawpoint] = useState<PathProps | null>(null);
  const [drawpath, setDrawpath] = useState<PathProps[]>([]);
  const [sendpath, setSendpath] = useState<boolean>(false);
  const date = new Date();

  // 임시 목적지: 역삼 멀티캠퍼스
  const destination = {latitude: 37.501303, longitude: 127.039603};

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setMyPosition({
          id: 1, // 임시
          roomId: 1, // 임시
          memberId: 1, // 임시
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    );
  }, []);

  useEffect(() => {
    // 내 위치 서버로 보내기
    client.current.send(
      `/gps/pub/location/${roomId}`,
      {},
      JSON.stringify(myPosition),
    );

    // 현재 위치와 목적지 위치의 거리 계산
    if (myPosition) {
      const distance = calculateDistance({
        lat1: myPosition.latitude,
        lon1: myPosition.longitude,
        lat2: 37.501303,
        lon2: 127.039603,
      });
      // 거리가 50m 이내인 경우 목적지에 도착했다고 알림
      if (distance <= 50) {
        console.log('목적지 도착');
        const arriveTime =
          date.getHours() +
          '시' +
          date.getMinutes() +
          '분' +
          date.getSeconds() +
          '초';
        store.dispatch(
          arrivePost({roomId: roomId, memberId: 1, arrivalTime: arriveTime}),
        );
      }
    }
  }, [myPosition]);

  // const userGrades = useSelector(userGrade);
  const userGrades = useSelector((state: RootState) => state.arrives.userGrade);

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

  // 경로 서버로 보내기
  function sendPath() {
    const postData = {
      senderEmail: 'rlawnsgh8395@naver.com',
      receiverEmail: 'rlawnsgh8395@gmail.com',
      path: drawpath,
    };
    store.dispatch(guidesPost(postData));
    Alert.alert('길안내 알림을 전송했어요!');
    setSendpath(false);
    setStartDraw(false);
  }

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

  return (
    <View>
      {myPosition && (
        <NaverMapView
          style={{width: '100%', height: '100%'}}
          onMapClick={e => {
            drawPath(e);
          }}
          center={{...myPosition, zoom: 14}}>
          {/* 임시 목적지 역삼 멀티캠퍼스 */}
          <Marker
            coordinate={destination}
            image={require('../../assets/icons/destination.png')}
            width={50}
            height={55}
          />
          {/* 반경 n미터 원으로 표시 */}
          <Circle
            coordinate={destination}
            color={'rgba(221, 226, 252, 0.5)'}
            radius={50}
          />
          {myPosition?.latitude && (
            <Marker
              coordinate={{
                latitude: myPosition.latitude,
                longitude: myPosition.longitude,
              }}
              image={require('../../assets/icons/bear.png')}
              width={45}
              height={50}
            />
          )}
          {users.map(user => (
            <Marker
              key={user.id}
              coordinate={{
                latitude: user.latitude,
                longitude: user.longitude,
              }}
              image={require('../../assets/icons/bear.png')}
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
      )}
      {startDraw === false ? (
        <View style={{position: 'absolute', top: 0, left: 0}}>
          <TouchableHighlight
            style={styles.button1}
            onPress={() => setStartDraw(true)}>
            <Text style={styles.font}>그리기</Text>
          </TouchableHighlight>
        </View>
      ) : sendpath === false ? (
        <View style={{position: 'absolute'}}>
          <View style={{backgroundColor: '#FFFFFF', alignItems: 'center'}}>
            <Text>손가락으로 길을 그려 친구에게 보내주세요!</Text>
          </View>
          <View
            style={{
              top: 630,
              left: 0,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <TouchableHighlight
              style={styles.button1}
              onPress={() => {
                setDrawpoint(null);
                setDrawpath([]);
              }}>
              <Text style={styles.font}>다시 그리기</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.button2}
              onPress={() => {
                setDrawpoint(null);
                setDrawpath([]);
                sendPath();
                console.log(drawpath);
              }}>
              <Text style={styles.font}>길 안내 전송하기</Text>
            </TouchableHighlight>
          </View>
        </View>
      ) : null}
      <TouchableHighlight>
        <Image
          style={{
            position: 'absolute',
            bottom: 550,
            right: 5,
            resizeMode: 'cover',
          }}
          source={require('../../assets/icons/info.png')}
        />
      </TouchableHighlight>
      {/* 등수 보여주는 예시 */}
      <View>
        <Text>{userGrades.grade}등으로 도착하셨습니다!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button1: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#D0D0D0',
    borderRadius: 15,
  },
  button2: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#FF9270',
    borderRadius: 15,
  },
  font: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default RealtimeMap;
