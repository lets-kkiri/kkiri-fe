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
      lat: 37.50263505530211,
      lng: 127.0377506415285,
      isNode: true,
    },
    {
      id: 1,
      title: 'Point1',
      lat: 37.501960002270515,
      lng: 127.03548845022681,
      isNode: true,
    },
    {
      id: 2,
      title: 'Point2',
      lat: 37.50064506680933,
      lng: 127.03366706940584,
      isNode: true,
    },
    {
      id: 3,
      title: 'Dest',
      lat: 37.49851815627377,
      lng: 127.03549813007466,
      isNode: true,
    },
  ];

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
