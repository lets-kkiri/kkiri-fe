import React, {useEffect, useState} from 'react';
import {TextInput, View} from 'react-native';
import styled from 'styled-components/native';
import ARMapView from '../components/ARnavi/ARView';
import Map from './Map';
import CompassHeading, {start} from 'react-native-compass-heading';

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
  const places = [
    {
      id: 0,
      title: 'Start',
      lat: 37.50193624244697,
      lng: 127.03938447682401,
      isNode: true,
    },
    {
      id: 1,
      title: 'Point1',
      lat: 37.50134613266238,
      lng: 127.03923714772884,
      isNode: true,
    },
    {
      id: 2,
      title: 'Point2',
      lat: 37.50107578673264,
      lng: 127.03936988846523,
      isNode: true,
    },
    {
      id: 3,
      title: 'Dest',
      lat: 37.50116128011996,
      lng: 127.03967528004125,
      isNode: true,
    },
  ];

  const [heading, setHeading] = useState(0);
  // compassHeading 처리를 위한 useEffect, mount시 설정, unmount시 해제
  // useEffect(() => {
  //   CompassHeading.start(3, heading => {
  //     if (geoState.compassHeading === 0) {
  //       const newGeoState = {...geoState};
  //       newGeoState.compassHeading = heading.heading;
  //       newGeoState.locationReady = true;
  //       setGeoState(newGeoState);
  //       CompassHeading.stop();
  //     }
  //   });

  //   return () => {
  //     if (listener.current) {
  //       Geolocation.clearWatch(listener.current);
  //     }
  //     CompassHeading.stop();
  //   };
  // }, []);

  return (
    <Container>
      <ARContainer>
        <ARMapView places={places} />
      </ARContainer>
      <MapContainer>
        <Map places={places} />
      </MapContainer>
    </Container>
  );
};

export default ARnavi;
