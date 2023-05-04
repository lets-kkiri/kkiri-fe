import React, {useEffect, useState} from 'react';
import {Button, TouchableHighlight, View, Text, StyleSheet} from 'react-native';
import NaverMapView, {Circle, Marker, Polyline} from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';

interface PathProps {
  latitude: number;
  longitude: number;
}

function Map() {
  const destination = {latitude: 37.501303, longitude: 127.039603};
  const date = new Date();

  const [startDraw, setStartDraw] = useState<boolean>(false);
  const [myPosition, setMyPosition] = useState<PathProps | null>(null);
  const [drawpoint, setDrawpoint] = useState<PathProps | null>(null);
  const [drawpath, setDrawpath] = useState<PathProps[]>([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setMyPosition({
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
          console.log(
            date.getHours() + '시',
            date.getMinutes() + '분',
            date.getSeconds() + '초',
          );
        }
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    );
  }, []);

  // console.log(myPosition?.latitude);
  // console.log(myPosition?.longitude);

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
    <View style={{flex: 1}}>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        onMapClick={e => {
          drawPath(e);
        }}
        center={{
          zoom: 14,
          ...destination,
        }}>
        {/* 임시 목적지 역삼 멀티캠퍼스 */}
        <Marker
          coordinate={destination}
          image={require('../assets/icons/destination.png')}
          width={30}
          height={35}
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
        {drawpath.length > 1 ? (
          <Polyline
            coordinates={drawpath}
            strokeColor="#B0BDFF"
            strokeWidth={5}
          />
        ) : null}
      </NaverMapView>
      {!startDraw ? (
        <View style={{position: 'absolute', top: 0, left: 0}}>
          <TouchableHighlight
            style={styles.button1}
            onPress={() => setStartDraw(true)}>
            <Text style={styles.font}>그리기</Text>
          </TouchableHighlight>
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
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
              setStartDraw(false);
              setDrawpoint(null);
              setDrawpath([]);
              console.log(drawpath);
            }}>
            <Text style={styles.font}>길 안내 전송하기</Text>
          </TouchableHighlight>
        </View>
      )}
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

export default Map;
