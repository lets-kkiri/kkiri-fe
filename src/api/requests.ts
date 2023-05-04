export const requests = {
  base_url: 'http://k8a606.p.ssafy.io',

  // 채팅 전송
  SEND_CHAT({roomId}) {
    return `/stomp/chat/send/${roomId}`;
  },

  // 실시간 위치 전송
  SEND_LOCATION({roomId}) {
    return `/stomp/gps/location/${roomId}`;
  },
};
