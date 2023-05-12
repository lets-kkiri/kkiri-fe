import * as React from 'react';
import axios from 'axios';
import {useState, useEffect, useRef, Linking} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Page
import Setting from './src/pages/Setting';
import Notification from './src/pages/Notification';
import Map from './src/pages/Map';

// Components
import Header from './src/components/Header';
import TabNavigator from './src/components/TabNavigator';

// Types
import {RootStackParamList} from './src/types';
import Chatroom from './src/pages/Chatroom';
import CreateMoim from './src/pages/CreateMoim';

// redux
// import userSlice from './src/slices/user';
import notiSlice from './src/slices/noti';
import {useAppDispatch} from './src/store';
import {createSocket, socketConnect} from './src/slices/socket';

// FCM 및 푸쉬 알림
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import uuid from 'react-native-uuid';

import EncryptedStorage from 'react-native-encrypted-storage';
import {requests} from './src/api/requests';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/index';
import SignIn from './src/pages/SignIn';

// Splash Screen
import SplashScreen from 'react-native-splash-screen';
import {Socket, io} from 'socket.io-client';
import Moim from './src/pages/Moim';
import {Text} from 'react-native';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const isLoggedIn: boolean = useSelector(
    (state: RootState) => state.persisted.user.isLoggedIn,
  );
  const deviceTokens: string[] = useSelector(
    (state: RootState) => state.persisted.user.deviceTokens,
  );
  const accessToken: string = useSelector(
    (state: RootState) => state.persisted.user.accessToken,
  );

  const [newSocket, SetNewSocket] = useState<WebSocket>();

  // 푸쉬 알람을 위한 설정
  const dispatch = useAppDispatch();

  // 채팅 연결
  const token = useSelector((state: RootState) => state.sockets.value);
  dispatch(createSocket(1));

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(
      'Message handled in the background!',
      remoteMessage.notification,
    );

    const notiMsg = remoteMessage.notification;
    const uniqueId = uuid.v4();
    const noti = {
      id: uniqueId,
      channelId: notiMsg?.android?.channelId,
      title: notiMsg?.title,
      message: notiMsg?.body,
      playSound: true,
      soundName: 'default',
      checked: false,
    };

    // console.log(noti);
    PushNotification.localNotification({...noti});
    dispatch(notiSlice.actions.pushNoti({...noti}));
  });

  // FCM을 위한 기기 토큰 설정
  useEffect(() => {
    async function getToken() {
      console.log('========= getToken 함수 시작 =========');
      try {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
        }
        const token = await messaging().getToken();
        if (!deviceTokens || deviceTokens.includes(token)) {
          console.log('deviceTokens 없음 이슈', deviceTokens);
          console.log('내 디바이스 토큰', token);
          return;
        }
        const response = await axios.post(
          requests.POST_FCM_TOKEN(),
          {deviceToken: token},
          {headers: {authorization: `Bearer ${accessToken}`}},
        );
        console.log('쏠 디바이스 토큰', token);
        console.log('getTokenRes : ', response);
      } catch (error) {
        console.error(error);
      }
    }
    if (isLoggedIn === true) {
      getToken();
    }
  }, [accessToken, deviceTokens, dispatch, isLoggedIn]);

  PushNotification.configure({
    // (optional) 토큰이 생성될 때 실행됨(토큰을 서버에 등록할 때 쓸 수 있음)
    onRegister: function (token: any) {
      // console.log('TOKEN:', token);
    },

    // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행
    onNotification: function (notification: any) {
      console.log('NOTIFICATION:', notification);
      if (notification.channelId === 'hurry') {
        if (notification.message || notification.data.message) {
          dispatch(
            notiSlice.actions.pushNoti({
              channelId: notification.channelId,
              id: notification.id,
              title: notification.title,
              message: notification.message,
              data: notification.data,
              checked: false,
            }),
          );
        }
      }

      // 모임 한 시간 전 알림 감지
      if (notification.channelId === 'open') {
        // 임시 모임 아이디 (알림 메시지에서 추출할 것)
        const moimId = 1;
        const socket = new WebSocket(
          `wss://k8a606.p.ssafy.io/ws/api/${moimId}`,
        );
        SetNewSocket(socket);
      }
      // process the notification

      // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) 등록한 액션을 누렀고 invokeApp이 false 상태일 때 실행됨, true면 onNotification이 실행됨 (Android)
    onAction: function (notification: any) {
      // console.log('ACTION:', notification.action);
      // console.log('NOTIFICATION:', notification);
      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err: Error) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });

  // 여러 종류의 채널로 세분화
  PushNotification.createChannel(
    {
      channelId: 'hurry', // (required)
      channelName: '재촉 알림', // (required)
      channelDescription: '재촉할 때 울리는 알림', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: boolean) =>
      console.log(`createChannel hurry returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.createChannel(
    {
      channelId: 'open',
      channelName: '모임 한 시간 전 알림',
      channelDescription: '모임 한 시간 전에 울리는 알림', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: boolean) =>
      console.log(`createChannel socket returned ${created}`),
  );

  // 로그인 관리를 위한 Token 확인
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      console.log('========= getTokenAndRefresh 함수 시작 =========');
      try {
        // splash screen on
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          // 토큰이 없으면 걍 리턴을 때려버린다
          console.log('refresh 토큰 없음');
          SplashScreen.hide();
          return;
        }
        const response = await axios.post(
          requests.REFRESH_TOKEN(),
          {},
          {headers: {authorization: `Bearer ${token}`}},
        );
        console.log('Refresh 토큰 살아있음', response.data);
        // 로그인 처리 및 accessToken 갱신
        // await batch(() => {
        //   dispatch(
        //     userSlice.actions.setAccessToken({
        //       accessToken: response.data.accessToken,
        //     }),
        //   );
        //   dispatch(
        //     userSlice.actions.setIsLoggedIn({
        //       isLoggedIn: true,
        //     }),
        //   );
        // });
        // refreshToken 갱신
        // await EncryptedStorage.setItem(
        //   'refreshToken',
        //   response.data.refreshToken,
        // );
      } catch (error) {
        console.error(error.message);
        // 만약 response가 error를 들고왔을 때, refreshToken이 만료된 경우
        // 로그아웃 처리 해줘야함
      } finally {
        // splash screen off
        SplashScreen.hide();
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);

  // deep link를 위한 settings
  // lets.kkiri://moim/1
  const linking = {
    prefixes: ['lets.kkiri://', 'http://끼리.kr'],
    config: {
      screens: {
        Moim: 'moim/:moimId',
      },
    },
  };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      {isLoggedIn ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Tab"
            component={TabNavigator}
            options={{header: () => <Header />}}
          />
          <Stack.Screen
            name="Setting"
            component={Setting}
            options={{title: '세팅'}}
          />
          <Stack.Screen
            name="Moim"
            component={Moim}
            options={{title: '모임 상세'}}
          />
          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{title: '알림센터'}}
          />
          <Stack.Screen
            name="Chatroom"
            component={Chatroom}
            options={{title: '채팅방'}}
          />
          <Stack.Screen
            name="CreateMoim"
            component={CreateMoim}
            options={{title: '모임 생성'}}
          />
          <Stack.Screen
            name="Map"
            component={Map}
            options={{title: '실시간 위치'}}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppInner;
