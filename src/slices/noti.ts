import {PayloadAction, createSlice} from '@reduxjs/toolkit';

// store -> root reducer(state) -> user slice, order slice
// state.user.email ...
// state.order
// state.ui.loading ...

// action : state를 변경하는 동작
// dispatch : action을 실제로 실행하는 함수
// reducer : action이 실제로 실행되면 state를 바꾸는 로직

// type notiDatatype = {
//   path: {latitude: number; longitude: number}[];
// };

export type notiType = {
  channelId: string;
  id: string;
  title: string;
  message: string;
  data: Object;
  checked: boolean;
};

const initialState: notiType[] = [];

const notiSlice = createSlice({
  name: 'noti',
  initialState,
  // 동기 action
  reducers: {
    pushNoti(state, action) {
      state.unshift({
        channelId: action.payload.channelId,
        id: action.payload.id,
        title: action.payload.title,
        message: action.payload.message,
        data: action.payload.data,
        checked: false,
      });
    },
    clickNoti(state, action) {
      const stateIdx = state.findIndex(item => item.id === action.payload.id);
      state[stateIdx].checked = true;
    },
    delNoti(state, action) {
      const newState = state.filter(
        (item: notiType) => item.id !== action.payload,
      );
      return newState;
    },
    // clear는 나중에 처리
    // clearNoti(state, action) {
    //   const newState: notiType[] = [];
    //   return newState;
    // },
  },
  // 비동기 action
  extraReducers: builder => {},
});

export default notiSlice;
