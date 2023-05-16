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
  CompleteCreate: {moimId: number};
  AddCard: undefined;
};

// 단일 메시지
export type MessageData = {
  seq: number;
  messageType: string;
  moimId: number;
  kakaoId: number | null;
  nickname: string | null;
  message: string;
  time: string | null;
};

// 멤버 정보
export interface Member {
  kakaoId: string;
  profileImage: string;
  nickname: string;
}

// 모임 정보
export interface Moim {
  moimId: number;
  name: string;
  placeName: string;
  date: string;
  time: string;
  lateFee: number;
  members: Member[];
}
