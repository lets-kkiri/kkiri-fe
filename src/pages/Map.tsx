import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';

function Map() {
  const P0 = {latitude: 37.564362, longitude: 126.977011};

  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
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
  }, []);

  return (
    <View>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        showsMyLocationButton={true}
        center={{
          zoom: 14,
          ...P0,
        }}>
        {myPosition?.latitude && (
          <Marker
            coordinate={{
              latitude: myPosition.latitude,
              longitude: myPosition.longitude,
            }}
            caption={{text: '지니'}}
          />
        )}
      </NaverMapView>
    </View>
  );
}

export default Map;
