import {NativeModules} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const {BackgroundTask} = NativeModules;

let socket;

export default async function locationUpdater() {
  BackgroundTask.schedule();

  // Create WebSocket connection to the server
  const moimId = 9;
  socket = new WebSocket(`wss://k8a606.p.ssafy.io/ws/api/${moimId}`);

  const date = new Date();

  // Send the user's location to the server every 10 seconds
  const sendLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        // 현재 위치와 목적지 위치의 거리 계산
        if (position) {
          // 내 위치 서버로 보내기 -> websocket 로직으로 변경하기
          if (socket) {
            const data = {
              type: 'GPS',
              content: {
                longitude: position.coords.longitude,
                latitude: position.coords.latitude,
                regDate: date.toISOString,
              },
            };
            socket.send(JSON.stringify(data));
            console.log('내 위치 보낸다');
            // socket.send(JSON.stringify(myPosition));
          }
        }
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    );

    setTimeout(sendLocation, 10000);
  };

  sendLocation();

  // Keep the background task running indefinitely
  await new Promise(() => {});

  // Close the WebSocket connection
  socket.close();

  BackgroundTask.finish();
  return socket;
}
