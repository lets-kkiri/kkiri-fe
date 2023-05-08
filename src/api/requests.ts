export const requests = {
  base_url: 'ws://k8a606.p.ssafy.io:8080',
  api_base_url: 'http://k8a606.p.ssafy.io:8080',

  // stomp 연결
  CONNECT: '/stomp',

  // 채팅
  CHAT(roomId: number) {
    return `/stomp/pub/chat/enter/${roomId}`;
  },

  // 실시간 위치
  LOCATION(roomId: number) {
    return `/stomp/gps/location/${roomId}`;
  },

  // 그린 경로 전송
  POST_GUIDES() {
    return '/api/noti/helps/guides';
  },

  // 그린 경로 전송
  POST_ARRIVE() {
    return '/api/noti/arrives'; // 임시
  },
};
