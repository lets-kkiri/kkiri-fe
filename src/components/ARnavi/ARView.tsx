import React, {useState, useEffect, useCallback, useRef} from 'react';
import {View, Platform, ToastAndroid, StyleSheet} from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroARPlaneSelector,
  ViroBox,
  ViroNode,
  ViroFlexView,
  ViroText,
  ViroImage,
  ViroARPlane,
  ViroMaterials,
  ViroPolyline,
  Viro3DObject,
  ViroAmbientLight,
} from '@viro-community/react-viro';
import Geolocation from '@react-native-community/geolocation';
import CompassHeading, {start} from 'react-native-compass-heading';
import usePermissions from '../../hooks/usePermissions';
// import {requestMultiple, PERMISSIONS, RESULTS} from 'react-native-permissions';

// Toast로 메시지 쏘기
const Toast = message => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};

// 질감(및 색) 표현
ViroMaterials.createMaterials({
  coloredLine: {
    diffuseColor: 'rgba(0, 0, 255, 0.3)',
  },
});

// 두 점 거리 구하는 함수
const distanceBetweenPoints = (p1, p2) => {
  if (!p1 || !p2) {
    return 0;
  }

  let R = 6371; // Radius of the Earth in km
  let dLat = ((p2.latitude - p1.latitude) * Math.PI) / 180;
  let dLon = ((p2.longitude - p1.longitude) * Math.PI) / 180;
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.latitude * Math.PI) / 180) *
      Math.cos((p2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d;
};

// 메인 함수
const MyScene = props => {
  // const data = props.sceneNavigator.viroAppProps.places;
  const nowHeading = props.sceneNavigator.viroAppProps.nowHeading;
  const places = props.sceneNavigator.viroAppProps.places;
  const myPosition = props.sceneNavigator.viroAppProps.myPosition;
  // console.log('=========프롭스=========', data);

  usePermissions();
  // 작업 확인해야함 --- 한별 ---
  // 최초 실행시 확인
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (tracking) {
      Toast('All set!');
    } else {
      Toast('Move your device around gently to calibrate AR and compass.');
    }
  }, [tracking]);

  const onInitialized = useCallback((state, reason) => {
    const isTracking = state === 3 || state === 4; // 3: TRACKING_NORMAL, 4: TRACKING_LIMITED
    setTracking(isTracking);
  }, []);

  // const [geoState, setGeoState] = useState({
  //   cameraReady: true,
  //   locationReady: false,
  //   location: undefined,
  //   nearbyPlaces: [],
  //   tracking: false,
  //   compassHeading: 0,
  // });

  // ==================== 계산 함수들 ====================
  // 위도, 경도 값을 m 단위로로 계산
  const latLongToMerc = useCallback((latDeg, longDeg) => {
    // From: https://gist.github.com/scaraveos/5409402
    const longRad = (longDeg / 180.0) * Math.PI;
    const latRad = (latDeg / 180.0) * Math.PI;
    const smA = 6378137.0;
    const xmeters = smA * longRad;
    const ymeters = smA * Math.log((Math.sin(latRad) + 1) / Math.cos(latRad));
    return {x: xmeters, y: ymeters};
  }, []);

  // GPS를 AR을 위한 값으로 변경
  const transformGpsToAR = useCallback(
    (lat, lng) => {
      const isAndroid = Platform.OS === 'android';
      const latObj = lat;
      const longObj = lng;
      const latMobile = myPosition.latitude;
      const longMobile = myPosition.longitude;

      const deviceObjPoint = latLongToMerc(latObj, longObj);
      const mobilePoint = latLongToMerc(latMobile, longMobile);
      const objDeltaY = deviceObjPoint.y - mobilePoint.y;
      const objDeltaX = deviceObjPoint.x - mobilePoint.x;

      if (isAndroid) {
        let degree = nowHeading;
        let angleRadian = (degree * Math.PI) / 180;
        let newObjX =
          objDeltaX * Math.cos(angleRadian) - objDeltaY * Math.sin(angleRadian);
        let newObjY =
          objDeltaX * Math.sin(angleRadian) + objDeltaY * Math.cos(angleRadian);

        return {x: newObjX, z: -newObjY};
      }

      return {x: objDeltaX, z: -objDeltaY};
    },
    [latLongToMerc, nowHeading, myPosition],
  );
  // ==================== 계산 함수들 ====================

  // ==================== 연결 Lines 구하는 과정 ====================
  const [lineState, setLineState] = useState([]);
  const [lineRender, setLineRender] = useState(false);

  const getLines = useCallback(() => {
    console.log('getLines 들어옴');
    if (places.length === 0 || lineState.length === places.length) {
      console.log('하지만 리턴 당함');
      return [];
    }

    const newLineState = [];
    for (let i = 0; i < places.length - 1; i++) {
      const startGeo = places[i];
      const endGeo = places[i + 1];
      const startGeoCoords = transformGpsToAR(
        startGeo.latitude,
        startGeo.longitude,
      );
      const endGeoCoords = transformGpsToAR(endGeo.latitude, endGeo.longitude);
      const startPosition = [startGeoCoords.x, 0, startGeoCoords.z];
      const relativePosition = [
        endGeoCoords.x - startGeoCoords.x,
        0,
        endGeoCoords.z - startGeoCoords.z,
      ];
      newLineState.push([[...startPosition], [...relativePosition]]);
    }
    setLineState(newLineState);
    setLineRender(true);
  }, [places, lineState.length, transformGpsToAR]);

  useEffect(() => {
    if (places && places.length > 0 && lineRender === false) {
      getLines();
    }
  }, [places, getLines, lineRender]);
  // ==================== 연결 Lines 구하는 과정 ====================

  // compassHeading 처리를 위한 useEffect, mount시 설정, unmount시 해제
  // useEffect(() => {
  //   if (!nowHeading || geoState.compassHeading !== 0) {
  //     return;
  //   }
  //   const newGeoState = {...geoState};
  //   newGeoState.compassHeading = nowHeading;
  //   newmyPositionReady = true;
  //   console.log('헤더 박았음==========', newGeoState);
  //   setGeoState(newGeoState);
  // }, [nowHeading]);

  // useEffect(() => {
  //   getCurrentLocation();

  //   // Clean up function
  //   return () => {
  //     if (listener.current !== null) {
  //       Geolocation.clearWatch(listener.current);
  //     }
  //   };
  // }, [geoState.compassHeading]);

  // 최근 위치 받아오기
  // const getCurrentLocation = useCallback(() => {
  //   if (
  //     geoState.cameraReady &&
  //     myPositionReady &&
  //     geoState.compassHeading
  //   ) {
  //     const geoSuccess = result => {
  //       console.log('geoSuccess', result);
  //       const newGeoState = {...geoState};
  //       newmyPosition = result.coords;
  //       console.log('newGeo', newGeoState);
  //       setGeoState(newGeoState);
  //     };

  //     listener.current = Geolocation.watchPosition(
  //       geoSuccess,
  //       error => {
  //         console.error('geoError', error.message);
  //       },
  //       {
  //         distanceFilter: 10,
  //       },
  //     );
  //   }
  // }, [geoState]);

  // 목적지 값 받아오기
  // const getNearbyPlaces = useCallback(
  //   async places => {
  //     // console.log('겟니어바이======', places);
  //     const newGeoState = {...geoState};
  //     newplaces = [...places];
  //     setGeoState(newGeoState);
  //   },
  //   [myPosition],
  // );

  // useEffect(() => {
  //   if (myPosition) {
  //     getNearbyPlaces(data);
  //   }
  // }, [myPosition, getNearbyPlaces]);

  const [startLoc, setStartLoc] = useState({latitude: 0, longitude: 0});
  const [boxRender, setBoxRender] = useState(false);

  useEffect(() => {
    if (myPosition === undefined) {
      return;
    }
    setStartLoc({
      latitude: myPosition.latitude,
      longitude: myPosition.longitude,
    });
  }, [myPosition]);

  // 지도 좌표값 위치 찍기
  const placeARObjects = useCallback(() => {
    if (
      !places ||
      places.length === 0 ||
      !startLoc ||
      startLoc.latitude === 0 ||
      startLoc.longitude === 0 ||
      boxRender === true
    ) {
      return undefined;
    }

    const placePoints = places.map((item, idx) => {
      const coords = transformGpsToAR(item.latitude, item.longitude);
      const scale = Math.abs(Math.round(coords.z / 15));
      // const scale = 100;
      const distance = distanceBetweenPoints(startLoc.location, {
        latitude: item.latitude,
        longitude: item.longitude,
      });
      // console.log(`${idx + 1}번째 포인트`);
      // console.log('coords :', coords);
      // console.log('distance :', distance);
      // console.log('scale :', scale);

      return (
        <ViroNode
          key={idx}
          scale={[scale, scale, scale]}
          rotation={[0, 0, 0]}
          position={[coords.x, 0, coords.z]}>
          <ViroFlexView
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <ViroText
              width={4}
              height={0.5}
              text={item.title}
              style={styles.helloWorldTextStyle}
            />
            <ViroText
              width={4}
              height={0.5}
              text={`${Number(distance).toFixed(2)} km`}
              style={styles.helloWorldTextStyle}
              position={[0, -0.75, 0]}
            />
            <ViroAmbientLight color="#ffffff" />
            {/* <Viro3DObject
              source={require('../../assets/objects/Cat_v1_L3.123cc81ac858-7d2c-4c7e-bf80-81982996d26d/12222_Cat_v1_l3.obj')}
              scale={[0.5, 0.5, 0.5]}
              position={[0, 0, 0]}
              rotation={[90, 150, 180]}
              type="OBJ"
            /> */}
            <ViroBox width={1} length={1} height={1} position={[0, -1.5, 0]} />
          </ViroFlexView>
        </ViroNode>
      );
    });
    setBoxRender(true);
    return placePoints;
  }, [boxRender, places, startLoc, transformGpsToAR]);

  // 지도 길 그리기
  const polyLines = useCallback(() => {
    if (lineState.length === 0) {
      return undefined;
    }

    const drawLines = lineState.map((line, idx) => {
      const startPoint = line[0];
      const endPoint = line[1];
      // console.log('start :', startPoint);
      // console.log('end :', endPoint);

      return (
        <ViroPolyline
          key={idx}
          position={startPoint}
          points={[startPoint, endPoint]}
          thickness={3}
          materials={['coloredLine']}
        />
      );
    });
    return drawLines;
  }, [lineState]);

  // AR 요소들 출력
  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {/* // onAnchorFound={() => console.log('onAnchorFound')}
      // onAnchorUpdated={() => console.log('onAnchorUpdated')}
      // onAnchorRemoved={() => console.log('onAnchorRemoved')}> */}
      {/* <ViroARPlane minHeight={0.5} minWidth={0.5} alignment={'Horizontal'}> */}
      {nowHeading && myPosition ? placeARObjects() : null}
      {lineState && lineState.length > 0 ? polyLines() : null}
      {/* </ViroARPlane> */}
    </ViroARScene>
  );
};

let styles = StyleSheet.create({
  f1: {flex: 1},
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#000000',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

function ARMapView({places, nowHeading, myPosition}) {
  // const [object, setObject] = useState('cat');
  return (
    <View style={styles.f1}>
      <ViroARSceneNavigator
        worldAlignment={'GravityAndHeading'}
        autofocus={true}
        initialScene={{
          scene: MyScene,
        }}
        viroAppProps={{places, nowHeading, myPosition}}
        style={styles.f1}
      />
    </View>
  );
}

export default ARMapView;
