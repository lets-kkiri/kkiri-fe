import * as React from 'react';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Page
import Setting from './src/pages/Setting';
import Notification from './src/pages/Notification';
import Map from './src/pages/Map';
import RealtimeLocation from './src/pages/RealtimeLocation';

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

// FCM 및 푸쉬 알림
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  //   const dispatch = useAppDispatch();

  // 토큰 설정
  useEffect(() => {
    async function getToken() {
      try {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
        }
        const token = await messaging().getToken();
        console.log('phone token', token);
        // dispatch(userSlice.actions.setPhoneToken(token));
        // 임시 Config
        const Config = {
          API_URL: 'k8a606.p.ssafy.io',
        };
        return axios.post(`${Config.API_URL}/api/auth/firebase`, {token});
      } catch (error) {
        console.error(error);
      }
    }
    if (isLoggedIn === true) {
      getToken();
    }
  }, [isLoggedIn]);

  // 푸쉬 알람을 위한 설정
  const dispatch = useAppDispatch();

  PushNotification.configure({
    // (optional) 토큰이 생성될 때 실행됨(토큰을 서버에 등록할 때 쓸 수 있음)
    onRegister: function (token: any) {
      console.log('TOKEN:', token);
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
      // process the notification

      // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) 등록한 액션을 누렀고 invokeApp이 false 상태일 때 실행됨, true면 onNotification이 실행됨 (Android)
    onAction: function (notification: any) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);

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
      console.log(`createChannel riders returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  return (
    <NavigationContainer>
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
        <Stack.Screen
          name="RealtimeLocation"
          component={RealtimeLocation}
          options={{title: '모임원 실시간 위치'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppInner;
