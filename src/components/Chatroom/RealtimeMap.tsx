import React, {useState} from 'react';
import {Button, View} from 'react-native';
import StompJs from '@stomp/stompjs';
import Geolocation from '@react-native-community/geolocation';
import NaverMapView, {Marker, Polyline} from 'react-native-nmap';

const RealtimeMap = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  return (
    <View>
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
    </View>
  );
};

export default RealtimeMap;
