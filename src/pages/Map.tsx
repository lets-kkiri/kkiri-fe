import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import NaverMapView, {Marker, Polyline, Circle} from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';
import store, {RootState} from '../store';
import {guidesPost} from '../slices/guidesSlice';
import {pressPost} from '../slices/pressSlice';
import {helpPost} from '../slices/helpSlice';
import CustomModal from '../components/Common/Modal';
import ArriveNoti from '../components/Map/ArriveNoti';
import SendPathNoti from '../components/Map/SendPathNoti';
import SendHelpNoti from '../components/Map/SendHelpNoti';
import CustomButton from '../components/Common/Button';
import AboutMoim from '../components/Map/AboutMoim';
import NotiBox from '../components/Common/NotiBox';
import {WithLocalSvg} from 'react-native-svg';

// svg
import Pencil from '../assets/icons/pencil.svg';
import Help from '../assets/icons/help.svg';
import Info from '../assets/icons/info.svg';
import {useSelector} from 'react-redux';
import {io} from 'socket.io-client';

interface PathProps {
  latitude: number;
  longitude: number;
}

function Map({places}) {
  const [destination, setDestination] = useState({});

  const [startDraw, setStartDraw] = useState<boolean>(false);
  const [myPosition, setMyPosition] = useState<PathProps | null>(null);
  const [drawpoint, setDrawpoint] = useState<PathProps | null>(null);
  const [drawpath, setDrawpath] = useState<PathProps[]>([]);

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

  useEffect(() => {
    console.log('맵의 프롭스입니다=========', places);
    if (!places) {
      return;
    }
    const newDrawPath = [];
    for (let i = 0; i < places.length; i++) {
      const point = {latitude: places[i].lat, longitude: places[i].lng};
      if (i === places.length - 1) {
        setDestination(point);
      }
      newDrawPath.push(point);
    }
    setDrawpath([...newDrawPath]);
  }, [places]);

  useEffect(() => {
    Geolocation.watchPosition(
      position => {
        const data = {
          type: 'GPS',
          content: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            regDate: date.toISOString(),
          },
        };
        console.log('서버로 내 위치 보내기');
        setMyPosition(data);

        // 현재 위치와 목적지 위치의 거리 계산
        const distance = calculateDistance({
          lat1: position.coords.latitude,
          lon1: position.coords.longitude,
          lat2: 37.501303,
          lon2: 127.039603,
        });

        // 거리가 50m 이내인 경우 목적지에 도착했다고 알림
        if (distance <= 50) {
          console.log('목적지 도착');
          const destinationTime = date.toISOString();
          dispatch(
            arrivePost({
              moimId: moimId,
              destinationTime: destinationTime,
            }),
          );
          setModalVisible(true);
          setModalType('arrive');
        }
        // 재귀적으로 자기 자신을 호출하여 일정 시간 후에 함수를 다시 실행
        // timerId = setTimeout(sendLocation, 30000);
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        distanceFilter: 5,
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

  return (
    <View style={{flex: 1}}>
      {myPosition ? (
        <NaverMapView
          style={{width: '100%', height: '100%'}}
          onMapClick={e => {
            drawPath(e);
          }}
          center={{
            zoom: 14,
            ...myPosition,
          }}>
          {/* 임시 목적지 역삼 멀티캠퍼스 */}
          {places?.map(place => {
            return (
              <Marker
                key={place.id}
                coordinate={{latitude: place.lat, longitude: place.lng}}
                image={require('../assets/icons/destination.png')}
                width={30}
                height={35}
              />
            );
          })}
          {places && (
            <Polyline
              coordinates={drawpath}
              strokeColor="#B0BDFF"
              strokeWidth={5}
            />
          )}
          {/* 반경 n미터 원으로 표시 */}
          {/* {destination && destination.lat && (
            <Circle
              coordinate={destination}
              color={'rgba(221, 226, 252, 0.5)'}
              radius={50}
            />
          )} */}
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
