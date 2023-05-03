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
          <View>
            <Button
              title="다시 그리기"
              onPress={() => {
                setDrawpoint(null);
                setDrawpath([]);
              }}
            />
            <Button
              title="보내기"
              onPress={() => {
                setStartDraw(false);
                setDrawpoint(null);
                setDrawpath([]);
                console.log(drawpath);
              }}
            />
          </View>
        )}
      </View>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
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
            image={require('../assets/icons/bear.png')}
            width={45}
            height={50}
          />
        )}
        {drawpath.length > 1 ? (
          <Polyline
            coordinates={drawpath}
            strokeColor="#B0BDFF"
            strokeWidth={5}
          />
        ) : null}
      </NaverMapView>
    </View>
  );
}

export default Map;
