import React, {useEffect, useState, useRef} from 'react';
import {Button, View} from 'react-native';
import StompJs from '@stomp/stompjs';
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Circle, Marker, Polyline} from 'react-native-nmap';

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

function RealtimeLocation() {
  const [myPosition, setMyPosition] = useState<UserProps | null>(null);
  const [users, setUsers] = useState<UserProps[]>([]);
  const client = useRef<any>({});

  const [startDraw, setStartDraw] = useState<boolean>(false);
  const [drawpoint, setDrawpoint] = useState<PathProps | null>(null);
  const [drawpath, setDrawpath] = useState<PathProps[]>([]);

  // 임시 목적지: 역삼 멀티캠퍼스
  const destination = {latitude: 37.501303, longitude: 127.039603};

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setMyPosition({
          id: 1,
          roomId: 1,
          memberId: 1,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        // 현재 위치와 목적지 위치의 거리 계산
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          37.501303,
          127.039603,
        );

        // 거리가 50m 이내인 경우 목적지에 도착했다고 알림
        if (distance <= 50) {
          console.log('목적지 도착');
        }
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    );
  }, []);

  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  // 임시 roomId
  const roomId = 1;

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: 'ws://k8a606.p.ssafy.io/stomp', // 웹소켓 서버로 직접 접속
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('connect success');
        subscribe();
      },
      onStompError: frame => {
        console.error(frame);
      },
    });

    client.current.activate();
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  // 서버에서 다른 사용자들의 위치 받아오기
  const subscribe = () => {
    client.current.subscribe(`/gps/sub/${roomId}`, user => {
      setUsers(userLocate => [...userLocate, JSON.parse(user.body)]);
    });
  };

  useEffect(() => {
    send(myPosition);
  }, [myPosition]);

  // 내 위치 서버로 보내기
  const send = myLocate => {
    client.current.send(
      `/gps/pub/location/${roomId}`,
      {},
      JSON.stringify(myLocate),
    );
  };

  const drawPath = e => {
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

  // 두 위치의 거리 계산 함수
  function calculateDistance(lat1, lon1, lat2, lon2) {
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

  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  return (
    <View>
      <View>
        {!startDraw ? (
          <Button title="그리기" onPress={() => setStartDraw(true)} />
        ) : (
          <View>
            <Button
              title="다시 그리기"
              onPress={() => {
                setDrawpoint(null);
                setDrawpath([]);
              }}
            />
            <Button
              title="보내기"
              onPress={() => {
                setStartDraw(false);
                setDrawpoint(null);
                setDrawpath([]);
                console.log(drawpath);
              }}
            />
          </View>
        )}
      </View>
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
            image={require('../assets/icons/destination.png')}
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
              image={require('../assets/icons/bear.png')}
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
              image={require('../assets/icons/bear.png')}
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
    </View>
  );
}

export default RealtimeLocation;
