import Geolocation from '@react-native-community/geolocation';

export default async function locationUpdater({socket}) {
  const date = new Date();
  function sendLocation() {
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

    setTimeout(sendLocation, 60000);
  }
  setTimeout(sendLocation, 60000);

  await new Promise(() => {});
}
