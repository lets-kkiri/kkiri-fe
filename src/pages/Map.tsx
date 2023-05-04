import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';
import NaverMapView, {Circle, Marker, Polyline} from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';

interface PathProps {
  latitude: number;
  longitude: number;
}

function Map() {
  const multi = {latitude: 37.501303, longitude: 127.039603};

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
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        onMapClick={e => {
          drawPath(e);
        }}
        center={{
          zoom: 14,
          ...multi,
        }}>
        {/* 임시 목적지 역삼 멀티캠퍼스 */}
        <Marker
          coordinate={multi}
          image={require('../assets/icons/destination.png')}
          width={50}
          height={55}
        />
        {/* 반경 n미터 원으로 표시 */}
        <Circle
          coordinate={multi}
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
    </View>
  );
}

export default Map;
