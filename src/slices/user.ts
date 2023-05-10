import {PayloadAction, createSlice} from '@reduxjs/toolkit';

// store -> root reducer(state) -> user slice, order slice
// state.user.email ...
// state.order
// state.ui.loading ...

// action : state를 변경하는 동작
// dispatch : action을 실제로 실행하는 함수
// reducer : action이 실제로 실행되면 state를 바꾸는 로직

const initialState = {
  id: '',
  nickname: '',
  profileImageUrl: '',
  email: '',
  accessToken: '',
  isLoggedIn: false,
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
  },
  // 비동기 action
  extraReducers: builder => {},
});

export default userSlice;
