import React, {useEffect, useState, useRef} from 'react';
import {Button, View} from 'react-native';
import StompJs from '@stomp/stompjs';
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Marker, Polyline} from 'react-native-nmap';

interface User {
  id: number;
  roomId: number;
  memberId: number;
  latitude: number;
  longitude: number;
  regDate: string;
}

interface PathProps {
  latitude: number;
  longitude: number;
}

function RealtimeLocation() {
  const [myPosition, setMyPosition] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const client = useRef<any>({});

  const [startDraw, setStartDraw] = useState<boolean>(false);
  const [drawpoint, setDrawpoint] = useState<PathProps | null>(null);
  const [drawpath, setDrawpath] = useState<PathProps[]>([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const id = 123;
        const roomId = 1;
        const memberId = 700003;
        const regDate = '2023-05-03';
        setMyPosition({id, roomId, memberId, latitude, longitude, regDate});
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000},
    );
  }, []);

  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: 'websocket_url', // 웹소켓 서버로 직접 접속
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('connect success');
        subscribe();
        send();
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
    client.current.subscribe('server_url', user => {
      setUsers(userLocate => [...userLocate, JSON.parse(user.body)]);
    });
  };

  // 내 위치 서버로 보내기
  const send = () => {
    client.current.send('server_url', {}, JSON.stringify(myPosition));
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

  return (
    <View>
      <View>
        {!startDraw ? (
          <Button title="그리기" onPress={() => setStartDraw(true)} />
        ) : (
          <Button
            title="보내기"
            onPress={() => {
              setStartDraw(false);
              setDrawpoint(null);
              setDrawpath([]);
              console.log(drawpath);
            }}
          />
        )}
      </View>
      {myPosition && (
        <NaverMapView
          style={{width: '100%', height: '100%'}}
          showsMyLocationButton={true}
          onMapClick={e => {
            drawPath(e);
          }}
          center={{...myPosition, zoom: 14}}>
          {myPosition?.latitude && (
            <Marker
              coordinate={{
                latitude: myPosition.latitude,
                longitude: myPosition.longitude,
              }}
              caption={{text: '나'}}
            />
          )}
          {users.map(user => (
            <Marker
              key={user.id}
              coordinate={{
                latitude: user.latitude,
                longitude: user.longitude,
              }}
              // caption={{text: user.id}}
            />
          ))}
          {drawpath.length > 1 ? (
            <Polyline
              coordinates={drawpath}
              strokeColor="#fcba03"
              strokeWidth={5}
            />
          ) : null}
        </NaverMapView>
      )}
    </View>
  );
}

export default RealtimeLocation;
