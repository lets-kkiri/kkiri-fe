export const requests = {
  base_url: 'ws://k8a606.p.ssafy.io:8080',

  // stomp 연결
  CONNECT: '/stomp',

  // 채팅
  CHAT(roomId) {
    // return `/chat.enter.${roomId}`;
    return `/pub/chat`;
  },

  // 실시간 위치
  LOCATION(roomId) {
    return `/gps/location/${roomId}`;
  },
};
