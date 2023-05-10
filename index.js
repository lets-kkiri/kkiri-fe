/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as encoding from 'text-encoding';

// // firebase import
// import messaging from '@react-native-firebase/messaging';

// // 백그라운드에서 push 메시지를 받을 때 실행되는 함수
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
//   // Alert.alert('Message handled in the background!', remoteMessage);
// });

AppRegistry.registerComponent(appName, () => App);
