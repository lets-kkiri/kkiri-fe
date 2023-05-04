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
import userSlice from './src/slices/user';
import {useAppDispatch} from './src/store';

// FCM 및 푸쉬 알림
import messaging from '@react-native-firebase/messaging';

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
