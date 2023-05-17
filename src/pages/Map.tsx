import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import NaverMapView, {Marker, Polyline} from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';
import store, { RootState } from '../store';
import {guidesPost} from '../slices/guidesSlice';
import {pressPost} from '../slices/pressSlice';
import {helpPost} from '../slices/helpSlice';
import CustomModal from '../components/Common/Modal';
import ArriveNoti from '../components/Map/ArriveNoti';
import SendPathNoti from '../components/Map/SendPathNoti';
import SendHelpNoti from '../components/Map/SendHelpNoti';
import CustomButton from '../components/Common/Button';
import AboutMoim from '../components/Map/AboutMoim';
import NotiBox from '../components/Common/NotiBox';
import {WithLocalSvg} from 'react-native-svg';

// svg
import Pencil from '../assets/icons/pencil.svg';
import Help from '../assets/icons/help.svg';
import Info from '../assets/icons/info.svg';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

interface PathProps {
  latitude: number;
  longitude: number;
}

function Map() {
  const destination = {latitude: 37.501303, longitude: 127.039603};

  const [startDraw, setStartDraw] = useState<boolean>(false);
  const [myPosition, setMyPosition] = useState<PathProps | null>(null);
  const [drawpoint, setDrawpoint] = useState<PathProps | null>(null);
  const [drawpath, setDrawpath] = useState<PathProps[]>([]);
  const [sendpath, setSendpath] = useState<boolean>(false);

  const [modalType, setModalType] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [sideModal, setSideModal] = useState<boolean>(false);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setMyPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        // 현재 위치와 목적지 위치의 거리 계산
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          37.501303,
          127.039603,
        );

        const date = new Date();

        // 거리가 50m 이내인 경우 목적지에 도착했다고 알림
        if (distance <= 50) {
          console.log('목적지 도착');
          const arriveTime = date.toISOString();
          // Alert.alert('목적지에 도착하였습니다!', arriveTime);
          setModalVisible(true);
          setModalType('arrive');
        }
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    );

    // 두 위치의 거리 계산 함수
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371e3; // 지구 반경 (m)
      const cal1 = toRadians(lat1);
      const cal2 = toRadians(lat2);
      const cal3 = toRadians(lat2 - lat1);
      const cal4 = toRadians(lon2 - lon1);

      const a =
        Math.sin(cal3 / 2) * Math.sin(cal3 / 2) +
        Math.cos(cal1) *
          Math.cos(cal2) *
          Math.sin(cal4 / 2) *
          Math.sin(cal4 / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c; // 두 지점 사이의 거리 (m)

      return distance;
    }

    function toRadians(degrees) {
      return (degrees * Math.PI) / 180;
    }
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

  // 경로 서버로 보내기
  function sendPath() {
    // 임시 데이터
    const postData = {
      senderEmail: 'rlawnsgh8395@naver.com',
      receiverEmail: 'rlawnsgh8395@gmail.com',
      path: drawpath,
    };
    store.dispatch(guidesPost(postData));
    // setSendpath(true);
    // Alert.alert('길안내 알림을 전송했어요!');
    setModalVisible(true);
    setModalType('sendpath');
    setSendpath(false);
    setStartDraw(false);
  }

  function sendPress() {
    Alert.alert('재촉했어요!');
    // 임시 데이터
    const postData = {
      senderEmail: '지니',
      receiverEmail: 'rlawnsgh8395@gmail.com',
    };
    store.dispatch(pressPost(postData));
  }

  function sendHelp() {
    // Alert.alert('도움 요청을 보냈어요!');
    setModalVisible(true);
    setModalType('sendhelp');
    // 임시 데이터
    const postData = {
      senderEmail: 'rlawnsgh8395@naver.com',
      chatRoomId: 6,
    };
    store.dispatch(helpPost(postData));
  }

  return (
    <View style={{flex: 1}}>
      {myPosition ? (
        <NaverMapView
          style={{width: '100%', height: '100%'}}
          onMapClick={e => {
            drawPath(e);
          }}
          center={{
            zoom: 14,
            ...myPosition,
          }}>
          {/* 임시 목적지 역삼 멀티캠퍼스 */}
          <Marker
            coordinate={destination}
            image={require('../assets/icons/destination.png')}
            width={30}
            height={35}
          />
          {/* 반경 n미터 원으로 표시 */}
          {/* <Circle
            coordinate={destination}
            color={'rgba(221, 226, 252, 0.5)'}
            radius={50}
          /> */}
          {myPosition?.latitude && (
            <Marker
              onClick={sendPress}
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
      ) : null}
      {startDraw === false ? (
        <NotiBox
          mainTitle="@친구가 도움을 요청했어요"
          subTitle="길을 헤매는 친구에게 길 안내를 보내주세요!"
          onPress={() => setStartDraw(true)}
          type="map"
        />
      ) : sendpath === false ? (
        <View style={{position: 'absolute', alignItems: 'center'}}>
          <View style={styles.drawnoti}>
            <WithLocalSvg asset={Pencil} width={16} height={18} />
            <Text>손가락으로 길을 그려 친구에게 보내주세요!</Text>
          </View>
          <View
            style={{
              top: 580,
              left: 0,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <CustomButton
              text="다시 그리기"
              status="disabled"
              width="short"
              onPress={() => {
                setDrawpoint(null);
                setDrawpath([]);
              }}
            />
            <CustomButton
              text="경로 전송하기"
              status="active"
              width="short"
              onPress={() => {
                setDrawpoint(null);
                setDrawpath([]);
                sendPath();
                console.log(drawpath);
              }}
            />
          </View>
        </View>
      ) : null}
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 110,
          left: 350,
        }}
        onPress={sendHelp}>
        <WithLocalSvg asset={Help} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 160,
          left: 350,
        }}
        onPress={() => setSideModal(true)}>
        <WithLocalSvg asset={Info} />
      </TouchableOpacity>
      <CustomModal
        modalVisible={modalVisible}
        content={
          modalType === 'arrive' ? (
            <ArriveNoti setModalVisible={setModalVisible} />
          ) : modalType === 'sendpath' ? (
            <SendPathNoti setModalVisible={setModalVisible} />
          ) : (
            <SendHelpNoti setModalVisible={setModalVisible} />
          )
        }
      />
      {sideModal ? <AboutMoim setSideModal={setSideModal} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  font: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  drawnoti: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 50,
    width: '90%',
    borderStyle: 'solid',
    borderColor: '#5968F2',
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 15,
  },
});

export default Map;
