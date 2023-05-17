import * as React from 'react';
import {useState, useEffect, useRef, Linking} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import locationUpdater from './src/hooks/useLocationUpdater';
// import BackgroundTimer from 'react-native-background-timer';
// import {AppRegistry} from 'react-native';
import {Text, View, useColorScheme, AppState} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {lightTheme, darkTheme} from './src/styles/theme';

// Page
import Setting from './src/pages/Setting';
import Notification from './src/pages/Notification';
import Map from './src/pages/Map';
import Moim from './src/pages/Moim';
import SignIn from './src/pages/SignIn';

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
import {socketConnect} from './src/slices/socket';

// FCM 및 푸쉬 알림
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import uuid from 'react-native-uuid';

import EncryptedStorage from 'react-native-encrypted-storage';
import {requests} from './src/api/requests';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/index';

// Splash Screen
import SplashScreen from 'react-native-splash-screen';
import CompleteCreate from './src/components/CreateMoim/CompleteCreate';
import BackgroundFetch, {
  setBackgroundFetchTask,
} from 'react-native-background-fetch';
import GlobalStyle from './src/styles/globalStyle';
import BackgroundTimer from 'react-native-background-timer';
import {authInstance} from './src/api/axios';
import AddCard from './src/components/MyPage/AddCard';
import userSlice from './src/slices/user';
import {logout} from '@react-native-seoul/kakao-login';

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
  const darkMode = useSelector(
    (state: RootState) => state.persisted.theme.darkmode,
  );
  // // 사용자 다크 모드
  // const colorScheme = useColorScheme();
  // console.log('다크모드', colorScheme);

  const [newSocket, setNewSocket] = useState<WebSocket | null>(null);

  // const myId = useSelector((state: RootState) => state.persisted.user.id);
  // const notices = useSelector((state: RootState) => state.persisted.noti);
  // const moimId = 101;

  // useEffect(() => {
  //   const socket = new WebSocket(`wss://k8a606.p.ssafy.io/ws/api/${moimId}`);
  //   console.log('socket');
  //   console.log('socket open');
  //   socket.onopen = () => {
  //     console.log('연결!');
  //     // 소켓 열고 유저 정보 보내기
  //     socket?.send(
  //       JSON.stringify({
  //         type: 'JOIN',
  //         content: {
  //           kakaoId: myId,
  //         },
  //       }),
  //     );
  //   };
  //   if (socket) {
  //     setNewSocket(socket);
  //   }

  //   // BackgroundFetch.configure(
  //   //   {
  //   //     minimumFetchInterval: 15, // 15분마다 실행
  //   //     stopOnTerminate: false, // 앱이 종료된 상태에서도 백그라운드 작업 계속 실행
  //   //     startOnBoot: true, // 기기 부팅 시 자동 시작
  //   //     enableHeadless: true, // 백그라운드 작업 실행을 위해 Headless JS 사용
  //   //     requiredNetworkType: BackgroundFetch.NETWORK_TYPE_UNMETERED, // Wi-Fi에 연결되어 있는 경우에만 실행
  //   //   },
  //   //   async taskId => {
  //   //     console.log(`BackgroundFetch Task ${taskId} fired`);

  //   //     // 앱이 백그라운드 상태에서도 특정 함수를 실행
  //   //     await locationUpdater({socket: newSocket});

  //   //     // 작업이 완료되었음을 알림
  //   //     BackgroundFetch.finish(taskId);
  //   //   },
  //   //   error => console.log(`BackgroundFetch failed to start: ${error}`),
  //   // );
  // }, []);

  // 푸쉬 알람을 위한 설정
  const dispatch = useAppDispatch();

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
  // const moimId = 1;
  // dispatch(socketConnect(moimId));

  useEffect(() => {
    async function getToken() {
      console.log('========= getToken 함수 시작 =========');
      try {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
        }
        const token = await messaging().getToken();
        if ((deviceTokens && deviceTokens.includes(token)) || !deviceTokens) {
          // console.log('여기서 처리해줘야 함');
          return;
        }
        console.log('토큰입니다.', token);
        const response = await authInstance.post(
          requests.POST_FCM_TOKEN(),
          {deviceToken: token},
          {headers: {authorization: `Bearer ${accessToken}`}},
        );
        dispatch(userSlice.actions.setDeviceTokens(token));
        console.log('getTokenRes : ', response.data);
      } catch (error) {
        console.error('FCM 토큰 설정할 때 나는 에러 : ', error);
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

      // 모임 한 시간 전 알림 감지
      if (notification.channelId === 'open') {
        // 임시 모임 아이디 (알림 메시지에서 추출할 것)
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
      console.error('fails to register:', err.message, err);
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
      channelId: 'comming', // (required)
      channelName: '모임 알림', // (required)
      channelDescription: '모임 1시간 전 알림', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: boolean) =>
      console.log(`createChannel comming returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.createChannel(
    {
      channelId: 'chat', // (required)
      channelName: '채팅 알림', // (required)
      channelDescription: '채팅 시작 알림', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: boolean) =>
      console.log(`createChannel comming returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  // PushNotification.createChannel(
  //   {
  //     channelId: 'open',
  //     channelName: '모임 한 시간 전 알림',
  //     channelDescription: '모임 한 시간 전에 울리는 알림', // (optional) default: undefined.
  //     soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
  //     importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //     vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  //   },
  //   (created: boolean) =>
  //     console.log(`createChannel socket returned ${created}`),
  // );

  PushNotification.createChannel(
    {
      channelId: 'sos',
      channelName: '도움 요청 알림',
      channelDescription: '누군가 도움을 요청했을 때 울리는 알림', // (optional) default: undefined.
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
        const response = await authInstance.post(
          requests.REFRESH_TOKEN(),
          {},
          {headers: {authorization: `Bearer ${token}`}},
        );
        console.log('Refresh 토큰 살아있음', response.config);
      } catch (error) {
        console.error('refresh 토큰 관리 :', error.message);
        // 만약 response가 error를 들고왔을 때, refreshToken이 만료된 경우
        if (error.status === 409) {
          const signOutWithKakao = async (): Promise<void> => {
            const message = await logout();
            console.log(message);
            const res = await authInstance.post(requests.SIGNOUT());
            if (res.status === 200) {
              const userInfo = {
                id: '',
                email: '',
                nickname: '',
                profileImageUrl: '',
                accessToken: '',
                isLoggedIn: false,
                deviceTokens: [],
              };
              dispatch(userSlice.actions.setUser({...userInfo}));
              EncryptedStorage.removeItem('refreshToken');
              console.log('로그아웃');
            }
          };
          signOutWithKakao();
        }
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
    prefixes: ['KAKAO_SCHEME://'],
    config: {
      screens: {
        Moim: 'kakaolink?moimId=:moimId',
      },
    },
  };

  const theme = useSelector((state: RootState) => state.persisted.theme.theme);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        {isLoggedIn === true ? (
          <Stack.Navigator>
            <Stack.Group
              screenOptions={{
                headerStyle: {backgroundColor: theme.color.background},
              }}>
              <Stack.Screen
                name="Tab"
                component={TabNavigator}
                options={{header: () => <Header />}}
              />
              {/* <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{title: '로그아웃'}}
              /> */}
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
              {/* <Stack.Screen name="Chatroom" options={{title: '채팅방'}}>
                {({route}) => <Chatroom route={route} client={newSocket} />}
              </Stack.Screen> */}
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
                name="CompleteCreate"
                component={CompleteCreate}
                options={{title: '모임 생성 완료'}}
              />
              <Stack.Screen
                name="Map"
                component={Map}
                options={{title: '실시간 위치'}}
              />
              <Stack.Screen
                name="AddCard"
                component={AddCard}
                options={{title: '카드 추가'}}
              />
            </Stack.Group>
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
    </ThemeProvider>
  );
}

export default AppInner;
