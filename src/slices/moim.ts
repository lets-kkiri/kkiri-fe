import {createSlice} from '@reduxjs/toolkit';

export type MoimType = {
  name: string;
  date: string;
  time: string;
  placeName: string;
  latitude: number;
  longitude: number;
  lateFee: number;
};

const initialState: MoimType = {
  name: '',
  date: '',
  time: '',
  placeName: '',
  latitude: 0,
  longitude: 0,
  lateFee: 0,
};

const moimSlice = createSlice({
  name: 'moim',
  initialState,
  // 동기 action
  reducers: {
    setName(state, action) {
      state.name = action.payload;
    },
    // setLink(state, action) {
    //   state.link = action.payload;
    // },
    setDate(state, action) {
      state.date = action.payload;
    },
    setTime(state, action) {
      state.time = action.payload;
    },
    setPlaceName(state, action) {
      state.placeName = action.payload;
    },
    setCoord(state, action) {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setLateFee(state, action) {
      state.lateFee = action.payload;
    },
  },
  // 비동기 action
  extraReducers: builder => {},
});

export default moimSlice;
