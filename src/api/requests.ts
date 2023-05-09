export const requests = {
  base_url: 'ws://k8a606.p.ssafy.io:8080',
  api_base_url: 'https://k8a606.p.ssafy.io',
  naver_url: 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode',

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

  // 도착 시간 전송 (반경 50m)
  POST_ARRIVE() {
    return '/api/moims/arrive';
  },

  // Naver Map API (장소 받아오기)
  GET_LOCATE(longitude: number, latitude: number) {
    return `/v2/gc?coords=${longitude},${latitude}&output=json&request=coordsToaddr&orders=roadaddr`;
  },

  // 재촉 알림
  POST_PRESS() {
    return '/api/noti/presses';
  },

  // 재촉 알림
  POST_HELP() {
    return '/api/noti/helps';
  },
};
