import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import {io} from 'socket.io-client';

interface User {
  id: string;
  latitude: number;
  longitude: number;
}

function RealtimeLocation() {
  const P0 = {latitude: 37.564362, longitude: 126.977011};
  const [users, setUsers] = useState<User[]>([]);

  return (
    <View>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        showsMyLocationButton={true}
        center={{
          zoom: 14,
          ...P0,
        }}>
        {users.map(user => (
          <Marker
            key={user.id}
            coordinate={{
              latitude: user.latitude,
              longitude: user.longitude,
            }}
          />
        ))}
      </NaverMapView>
    </View>
  );
}

export default RealtimeLocation;
