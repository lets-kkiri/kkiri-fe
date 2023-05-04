export const requests = {
  base_url: 'ws://k8a606.p.ssafy.io:8080',

  // stomp 연결
  CONNECT: '/stomp',

  // 채팅
  CHAT({roomId}) {
    return `/stomp/pub/chat/enter/${roomId}`;
  },

  // 실시간 위치
  LOCATION({roomId}) {
    return `/stomp/gps/location/${roomId}`;
  },
};
