import React from 'react';
import {TextInput, View} from 'react-native';
import styled from 'styled-components/native';
import ARMapView from '../components/ARnavi/ARView';
import Map from './Map';

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
      lat: 37.50142037422344,
      lng: 127.0395114340882,
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
