export const requests = {
  base_url: 'https://k8a606.p.ssafy.io',
  ws_base_url: 'ws://k8a606.p.ssafy.io:8080',

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

  // 로그인
  SIGNIN() {
    return `${this.base_url}/api/auth/login`;
  },

  // Refresh Token 검증
  REFRESH_TOKEN() {
    return `${this.base_url}/api/auth/verify`;
  },

  // 사용자 FCM 토큰 저장
  POST_FCM_TOKEN() {
    return `${this.base_url}/api/members/devices`;
  },
};
