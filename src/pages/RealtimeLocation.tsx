import React, {useEffect, useState, useRef} from 'react';
import {View} from 'react-native';
// import Stomp from 'stompjs';
import StompJs from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Marker} from 'react-native-nmap';

interface User {
  id: string;
  latitude: number;
  longitude: number;
}

const RealtimeLocation = () => {
  const [location, setLocation] = useState<User>({
    id: '',
    latitude: 0,
    longitude: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const client = useRef({});

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const id = 'userId';
        setLocation({id, latitude, longitude});
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
    client.current.send('server_url', {}, JSON.stringify(location));
  };

  return (
    <View>
      {location && (
        <NaverMapView
          style={{width: '100%', height: '100%'}}
          showsMyLocationButton={true}
          center={{...location, zoom: 16}}>
          {location?.latitude && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
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
              caption={{text: user.id}}
            />
          ))}
        </NaverMapView>
      )}
    </View>
  );
};

export default RealtimeLocation;
