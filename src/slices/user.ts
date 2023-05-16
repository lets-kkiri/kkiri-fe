import {PayloadAction, createSlice} from '@reduxjs/toolkit';

// store -> root reducer(state) -> user slice, order slice
// state.user.email ...
// state.order
// state.ui.loading ...

// action : state를 변경하는 동작
// dispatch : action을 실제로 실행하는 함수
// reducer : action이 실제로 실행되면 state를 바꾸는 로직

interface UserState {
  id: string;
  nickname: string;
  profileImageUrl: string;
  email: string;
  accessToken: string;
  isLoggedIn: boolean;
  deviceTokens: string[];
}

const initialState: UserState = {
  id: '',
  nickname: '',
  profileImageUrl: '',
  email: '',
  accessToken: '',
  isLoggedIn: false,
  deviceTokens: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  // 동기 action
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.nickname = action.payload.nickname;
      state.profileImageUrl = action.payload.profileImageUrl;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.deviceTokens = [...action.payload.deviceTokens];
    },
    setNickname(state, action) {
      state.nickname = action.payload;
    },
    setProfileImageUrl(state, action) {
      state.profileImageUrl = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setDeviceTokens(state, action) {
      state.deviceTokens.push(action.payload);
    },
  },
  // 비동기 action
  extraReducers: builder => {},
});

export default userSlice;
