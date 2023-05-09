import React, {useState} from 'react';
import {Button, View} from 'react-native';
import StompJs from '@stomp/stompjs';
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Marker, Polyline} from 'react-native-nmap';
import styled from 'styled-components/native';

// Styled component
const MapContainer = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const RealtimeMap = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  return (
    <MapContainer>
      <NaverMapView style={{width: '100%', height: '100%'}}>
        {users.map(user => (
          <Marker
            key={user.id}
            coordinate={{
              latitude: user.latitude,
              longitude: user.longitude,
            }}
            // caption={{text: user.id}}
          />
        ))}
      </NaverMapView>
    </MapContainer>
  );
};

export default RealtimeMap;
