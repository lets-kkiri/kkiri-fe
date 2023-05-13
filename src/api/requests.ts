export const requests = {
  base_url: 'https://k8a606.p.ssafy.io',
  ws_base_url: 'ws://k8a606.p.ssafy.io:8080',
  naver_url: 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode',

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
  GET_CHAT(moimId: number, size: number, lastMessageId?: string) {
    if (lastMessageId) {
      return `api/chat?moimId=${moimId}&size=${size}&lastMessageId=${lastMessageId}`;
    }
    return `api/chat?moimId=${moimId}&size=${size}&`;
  },

  // 모임 생성
  POST_CREATE_MOIM() {
    return '/api/moims';
  },

  // 모임 링크 연결
  POST_CREATE_LINK() {
    return '/api/moims/links';
  },

  // 모임 상세 정보 조회
  GET_MOIM_INFO(moimId: number) {
    return `/api/moims/${moimId}`;
  },
};
