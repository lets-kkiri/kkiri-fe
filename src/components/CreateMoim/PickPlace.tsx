import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import store from '../../store';
import {markGet} from '../../slices/markSlice';
import {useSelector} from 'react-redux';
import {PersistedRootState} from '../../store/reducer';

function PickPlace() {
  const destination = {latitude: 37.501303, longitude: 127.039603};
  const [lon, setLon] = useState(0);
  const [lat, setLat] = useState(0);

  const getLocate = event => {
    const latitude = event.latitude;
    const longitude = event.longitude;
    store.dispatch(markGet({longitude, latitude}));
    setLon(longitude);
    setLat(latitude);
  };

  const addr = useSelector((state: PersistedRootState) => state.marks.addr);

  return (
    <View style={{flex: 1}}>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        onMapClick={event => {
          console.log('click');
          getLocate(event);
        }}
        center={{
          zoom: 14,
          ...destination,
        }}>
        <Marker
          coordinate={{latitude: lat, longitude: lon}}
          image={require('../assets/icons/pick.png')}
          width={30}
          height={40}
        />
      </NaverMapView>
      <View style={{position: 'absolute', bottom: 0, backgroundColor: '#FFF'}}>
        <Text>
          {addr.area1Name} {addr.area2Name} {addr.area3Name} {addr.area4Name}{' '}
          {addr.landName} {addr.landNumber} {addr.landValue}
        </Text>
        <Button
          title="이 장소가 맞아요"
          onPress={() => console.log('이 장소가 맞아요')}
        />
      </View>
    </View>
  );
}

export default PickPlace;
