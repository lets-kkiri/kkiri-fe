import React, {useEffect, useState, useRef} from 'react';
import {Button, View} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Marker, Polyline} from 'react-native-nmap';

interface UserProps {
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
          regDate: '2023-05-03',
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    );
  }, []);

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
