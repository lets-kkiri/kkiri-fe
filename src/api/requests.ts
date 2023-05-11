export const requests = {
  base_url: 'https://k8a606.p.ssafy.io',
  ws_base_url: 'ws://k8a606.p.ssafy.io:8080',

  // stomp 연결
  CONNECT: '/stomp',

  // 채팅
  CHAT(roomId: number) {
    return `/pub/chat.enter.${roomId}`;
    // return `/pub/chat`;
  },

  // 실시간 위치
  LOCATION(roomId: number) {
    return `/gps/location/${roomId}`;
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

  // 이전 채팅 내용 불러오기
  GET_CHAT(moimId: number, size: number, lastMessageId: number) {
    return `api/chat?moimId=${moimId}&size=${size}&lastMessageId=${lastMessageId}`;
  },
};
