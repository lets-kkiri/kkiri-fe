import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import store from '../../store';
import {markGet} from '../../slices/markSlice';
import {useSelector} from 'react-redux';
// import {PersistedRootState} from '../../store/reducer';
import {RootState} from '../../store';
import {MoimType} from '../../slices/moim';
import {SetMoimType} from '../../pages/CreateMoim';
import styled from 'styled-components/native';
import CustomButton from '../Common/Button';

// Styled component
const MapContainer = styled.View`
  flex: 0.8;
`;

const BottomTextContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const BottomContainer = styled.View`
  align-items: center;
  justify-content: flex-end;
  flex: 0.2;
  padding-bottom: 20px;
`;

// PickPlaceProps 타입 추가
interface PickPlaceProps {
  moim: MoimType;
  setMoim: SetMoimType;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean[]>>;
  isPicked: boolean;
  setIsPicked: React.Dispatch<React.SetStateAction<boolean>>;
}

function PickPlace({
  moim,
  setMoim,
  setFormOpen,
  isPicked,
  setIsPicked,
}: PickPlaceProps) {
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

  useEffect(() => {
    if (!moim) {
      return;
    }
    setLon(moim.longitude);
    setLat(moim.latitude);
  }, [moim]);

  // persist 처리 말고 방법 없을까..? 새 약속 만들때도 기존 약속 장소가 그대로 남아있음.
  const addr = useSelector((state: RootState) => state.persisted.marks.addr);

  // 미래에 검색 기능 넣어야 함
  // 나가는 버튼 만들기
  return (
    <View style={{flex: 1}}>
      <MapContainer>
        <NaverMapView
          style={{width: '100%', height: '100%'}}
          onMapClick={event => {
            setIsPicked(true);
            getLocate(event);
          }}
          center={{
            zoom: 14,
            ...destination,
          }}>
          <Marker
            coordinate={{latitude: lat, longitude: lon}}
            // image 경로에 없어서 일단 임시로 다른거 넣어둠
            image={require('../../assets/icons/bear.png')}
            width={30}
            height={40}
          />
        </NaverMapView>
      </MapContainer>
      <BottomContainer>
        <BottomTextContainer>
          {isPicked === true ? (
            <>
              <Text>
                {addr.area1Name} {addr.area2Name} {addr.landName}{' '}
                {addr.landNumber}
              </Text>
              {addr.landValue ? <Text>{addr.landValue}</Text> : null}
            </>
          ) : (
            <Text>지도를 클릭해 약속 장소를 알려주세요!</Text>
          )}
        </BottomTextContainer>
        <CustomButton
          text="이 장소가 맞아요"
          status={isPicked === true ? 'active' : 'disabled'}
          width="long"
          onPress={() => {
            if (isPicked !== true) {
              return;
            }
            setMoim(prevMoim => ({
              ...prevMoim,
              placeName: `${addr.area2Name} ${addr.landName} ${addr.landNumber} ${addr.landValue}`,
              latitude: lat,
              longitude: lon,
            }));
            setFormOpen([...[false, false, false]]);
          }}
        />
      </BottomContainer>
    </View>
  );
}

export default PickPlace;
