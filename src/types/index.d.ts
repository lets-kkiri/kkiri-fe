export type RootStackParamList = {
  // 루트이름 : 파라미터 정의
  // [name]: params;
  Tab: undefined;
  Setting: undefined;
  Notification: undefined;
  Chatroom: {moimId: number};
  Map: undefined;
  CreateMoim: undefined;
  SignIn: undefined;
  Moim: {moimId: number};
};

// 단일 메시지
export type MessageData = {
  messageType: string;
  moimId: number;
  memberKakaoId: number;
  nickname: string;
  message: string;
  time: string;
};
