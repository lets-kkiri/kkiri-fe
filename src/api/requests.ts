export const requests = {
  base_url: 'http://k8a606.p.ssafy.io:8080',

  // stomp 연결
  CONNECT: '/stomp',

  // 채팅 전송
  CHAT({roomId}) {
    return `/stomp/chat/send/${roomId}`;
  },

  // 실시간 위치 전송
  LOCATION({roomId}) {
    return `/stomp/gps/location/${roomId}`;
  },
};
