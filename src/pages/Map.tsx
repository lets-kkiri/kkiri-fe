import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';
import NaverMapView, {Marker, Polyline} from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';

interface PathProps {
  latitude: number;
  longitude: number;
}

function Map() {
  const P0 = {latitude: 37.564362, longitude: 126.977011};

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

  return (
    <View>
      <View>
        {!startDraw ? (
          <Button title="그리기" onPress={() => setStartDraw(true)} />
        ) : (
          <Button
            title="보내기"
            onPress={() => {
              setStartDraw(false);
              setDrawpoint(null);
              setDrawpath([]);
              console.log(drawpath);
            }}
          />
        )}
      </View>
      <NaverMapView
        style={{width: '100%', height: '95%'}}
        showsMyLocationButton={true}
        onMapClick={e => {
          drawPath(e);
        }}
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
            caption={{text: '나'}}
          />
        )}
        {drawpath.length > 1 ? (
          <Polyline
            coordinates={drawpath}
            strokeColor="#fcba03"
            strokeWidth={5}
          />
        ) : null}
      </NaverMapView>
    </View>
  );
}

export default Map;
