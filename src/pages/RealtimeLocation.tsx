import React, {useEffect, useState, useRef} from 'react';
import {Button, View} from 'react-native';
import StompJs from '@stomp/stompjs';
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Marker, Polyline} from 'react-native-nmap';

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

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setMyPosition({
          id: 123,
          roomId: 1,
          memberId: 700003,
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
    connect();

    return () => disconnect();
  }, []);

  // 임시 roomId
  const roomId = 1;

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: 'wss://k8a606.p.ssafy.io/stomp', // 웹소켓 서버로 직접 접속
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
