import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import NaverMapView, {Marker, Polyline, Circle} from 'react-native-nmap';

interface PathProps {
  latitude: number;
  longitude: number;
}

// 상수 함수들
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
// 각도 계산 함수
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// Map 렌더링 함수
function Map({places, nowHeading, myPosition}) {
  // 지도에 길 그리기
  const [destination, setDestination] = useState<PathProps>(undefined);

  // 도착 로직 등을 위한 모달 세팅
  // const [modalType, setModalType] = useState<string>('');
  // const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    // console.log('========== 받아온 경로 정보 =========', places);
    if (!places && places.length < 1) {
      return;
    }
    const lastPlace = places[places.length - 1];
    console.log(lastPlace);
    setDestination({
      latitude: lastPlace.latitude,
      longitude: lastPlace.longitude,
    });
  }, [places]);

  useEffect(() => {
    // console.log('========== 받아온 내 위치 정보 정보 =========', myPosition);
    // console.log('========== 받아온 경로 도착지 정보 =========', destination);
    if (!myPosition || !destination) {
      return;
    }

    // 현재 위치와 목적지 위치의 거리 계산
    const distance = calculateDistance(
      myPosition.latitude,
      myPosition.longitude,
      destination.latitude,
      destination.longitude,
    );

    // 거리가 10m 이내인 경우 목적지에 도착했다고 알림
    if (distance <= 10) {
      console.log('목적지 도착');
      const date = new Date();
      const arriveTime = date.toISOString();
      Alert.alert('목적지에 도착하였습니다!', arriveTime);
      // setModalVisible(true);
      // setModalType('arrive');
    }
  }, [myPosition, destination]);

  return (
    <View style={{flex: 1}}>
      {myPosition !== undefined && nowHeading !== undefined ? (
        <NaverMapView
          compass={true}
          zoomControl={false}
          style={{width: '100%', height: '100%'}}
          center={{
            zoom: 16,
            tilt: 100,
            bearing: nowHeading,
            ...myPosition,
          }}>
          {/* 목적지 Marker */}
          {destination && (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              image={require('../assets/icons/destination.png')}
              width={30}
              height={35}
            />
          )}
          <Circle
            coordinate={destination}
            color={'rgba(221, 226, 252, 0.7)'}
            radius={10}
          />
          {places && (
            <Polyline
              coordinates={places}
              strokeColor="#B0BDFF"
              strokeWidth={5}
            />
          )}
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
        </NaverMapView>
      ) : null}
    </View>
  );
}

export default Map;
