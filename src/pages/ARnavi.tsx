import React, {useEffect, useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import styled from 'styled-components/native';
import ARMapView from '../components/ARnavi/ARView';
import Map from './Map';
import CompassHeading, {start} from 'react-native-compass-heading';

import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Geolocation from '@react-native-community/geolocation';

const Container = styled.View`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const ARContainer = styled.View`
  flex: 0.65;
`;

const MapContainer = styled.View`
  flex: 0.35;
`;

const ARnavi = () => {
  const notices = useSelector((state: RootState) => state.persisted.noti);
  // const listener = useRef(null);

  const [places, setPlaces] = useState([]);
  const [nowHeading, setNowHeading] = useState(-1);
  const [myPosition, setMyPosition] = useState({});

  // notice에서 path 파싱하기
  useEffect(() => {
    if (notices && notices.length > 0 && notices[0].channelId === 'path') {
      const notiPath = notices[0].data.path;
      const parsedPath = JSON.parse(notiPath);
      setPlaces([...parsedPath]);
    }
  }, [notices]);

  // heading 설정
  useEffect(() => {
    CompassHeading.start(3, compass => {
      setNowHeading(compass.heading);
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  // 현재 위치 불러오기

  let listener: any = useRef(null);

  useEffect(() => {
    if (listener.current === null) {
      // console.log('최신 아이디!');
      listener.current = Geolocation.getCurrentPosition(
        position => {
          setMyPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        console.error,
        {
          enableHighAccuracy: true,
          timeout: 20000,
        },
      );
    } else {
      listener.current = Geolocation.watchPosition(
        position => {
          // console.log('워치 : ', position);
          setMyPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        console.error,
        {
          enableHighAccuracy: true,
          timeout: 20000,
          distanceFilter: 1,
        },
      );
    }

    return () => {
      if (listener.current !== null) {
        Geolocation.clearWatch(listener.current);
      }
    };
  }, [myPosition]);

  // useEffect(() => {
  //   console.log('애들 확인 ======', places, nowHeading, myPosition);
  // }, [places, nowHeading, myPosition]);

  if (
    !places ||
    places.length < 1 ||
    nowHeading === undefined ||
    nowHeading === -1 ||
    !myPosition ||
    !myPosition.latitude
  ) {
    return null;
  }

  return (
    <Container>
      <ARContainer>
        <ARMapView
          places={places}
          nowHeading={nowHeading}
          myPosition={myPosition}
        />
      </ARContainer>
      <MapContainer>
        <Map places={places} nowHeading={nowHeading} myPosition={myPosition} />
      </MapContainer>
    </Container>
  );
};

export default ARnavi;
