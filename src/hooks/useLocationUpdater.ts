import Geolocation from '@react-native-community/geolocation';

export default async function locationUpdater({moimId}) {
  // Create WebSocket connection to the server
  // const moimId = 9; // moimId store에서 꺼내오기
  const socket = new WebSocket(`wss://k8a606.p.ssafy.io/ws/api/${moimId}`);

  const date = new Date();

  // Send the user's location to the server every 10 seconds
  socket.onopen = () => {
    const sendLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          // 현재 위치와 목적지 위치의 거리 계산
          if (position) {
            if (socket) {
              const data = {
                type: 'GPS',
                content: {
                  longitude: position.coords.longitude,
                  latitude: position.coords.latitude,
                  regDate: date.toISOString(),
                },
              };
              socket.send(JSON.stringify(data));
              console.log('내 위치 보낸다');
              console.log(data);
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
  };

  // Keep the background task running indefinitely
  await new Promise(() => {});

  return socket;
}
