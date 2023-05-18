import React, {useEffect, useState} from 'react';
import {TextInput, View} from 'react-native';
import styled from 'styled-components/native';
import ARMapView from '../components/ARnavi/ARView';
import Map from './Map';
import CompassHeading, {start} from 'react-native-compass-heading';

import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

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
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (notices && notices.length > 0 && notices[0].channelId === 'path') {
      const notiPath = notices[0].data.path;
      const parsedPath = JSON.parse(notiPath);
      setPlaces([...parsedPath]);
    }
  }, [notices]);

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
