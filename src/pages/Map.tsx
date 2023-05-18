import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import NaverMapView, {Marker, Polyline, Circle} from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';
import CompassHeading, {start} from 'react-native-compass-heading';

interface PathProps {
  latitude: number;
  longitude: number;
}

function Map({places}) {
  const [destination, setDestination] = useState({});
  const [nowHeading, setNowHeading] = useState(0);

  const [startDraw, setStartDraw] = useState<boolean>(false);
  const [myPosition, setMyPosition] = useState<PathProps | null>(null);
  const [drawpoint, setDrawpoint] = useState<PathProps | null>(null);
  const [drawpath, setDrawpath] = useState<PathProps[]>([]);

  const [modalType, setModalType] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    console.log('맵의 프롭스입니다=========', places);
    if (!places && places.length < 1) {
      return;
    }
    const newDrawPath = [];
    for (let i = 0; i < places.length; i++) {
      const point = {
        latitude: places[i].latitude,
        longitude: places[i].longitude,
      };
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
        setMyPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        // 현재 위치와 목적지 위치의 거리 계산
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          destination.latitude,
          destination.longitude,
        );

        const date = new Date();

        // 거리가 50m 이내인 경우 목적지에 도착했다고 알림
        if (distance <= 50) {
          console.log('목적지 도착');
          const arriveTime = date.toISOString();
          // Alert.alert('목적지에 도착하였습니다!', arriveTime);
          setModalVisible(true);
          setModalType('arrive');
        }
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    );

    // 두 위치의 거리 계산 함수
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371e3; // 지구 반경 (m)
      const cal1 = toRadians(lat1);
      const cal2 = toRadians(lat2);
      const cal3 = toRadians(lat2 - lat1);
      const cal4 = toRadians(lon2 - lon1);

      const a =
        Math.sin(cal3 / 2) * Math.sin(cal3 / 2) +
        Math.cos(cal1) *
          Math.cos(cal2) *
          Math.sin(cal4 / 2) *
          Math.sin(cal4 / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c; // 두 지점 사이의 거리 (m)

      return distance;
    }

    function toRadians(degrees) {
      return (degrees * Math.PI) / 180;
    }
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

  // compassHeading 처리를 위한 useEffect, mount시 설정, unmount시 해제
  useEffect(() => {
    CompassHeading.start(3, heading => {
      setNowHeading(heading.heading);
      // console.log('nowHeading =====', heading.heading);
    });
    return () => {
      CompassHeading.stop();
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      {myPosition ? (
        <NaverMapView
          compass={true}
          zoomControl={false}
          style={{width: '100%', height: '100%'}}
          onMapClick={e => {
            drawPath(e);
          }}
          center={{
            zoom: 16,
            tilt: 100,
            bearing: nowHeading,
            ...myPosition,
          }}>
          {/* 목적지 Marker */}
          {places && (
            <Marker
              coordinate={{
                latitude: places[places.length - 1].latitude,
                longitude: places[places.length - 1].longitude,
              }}
              image={require('../assets/icons/destination.png')}
              width={30}
              height={35}
            />
          )}
          {/* {places?.map(place => {
            return (
              <Marker
                key={place.id}
                coordinate={{latitude: place.lat, longitude: place.lng}}
                image={require('../assets/icons/destination.png')}
                width={30}
                height={35}
              />
            );
          })} */}
          {/* 반경 n미터 원으로 표시 */}
          {!startDraw && (
            <Circle
              coordinate={destination}
              color={'rgba(221, 226, 252, 0.7)'}
              radius={50}
            />
          )}
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
