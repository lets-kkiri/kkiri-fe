import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {requests} from '../api/requests';
import {authInstance} from '../api/axios';

type MemberInfo = {
  kakaoId: string;
  profileImage: string;
  nickname: string;
};

interface MoimDetailType {
  moimId: number;
  name: string;
  placeName: string;
  latitude: string;
  longitude: string;
  date: string;
  time: string;
  lateFee: number;
  members: MemberInfo[];
}

const initialState: MoimDetailType = {
  moimId: 0,
  name: '',
  placeName: '',
  latitude: '',
  longitude: '',
  date: '',
  time: '',
  lateFee: 0,
  members: [],
};

export const getMoimInfo = createAsyncThunk(
  'moimDetail/get',
  async (data: number, thunkAPI) => {
    const response = await authInstance.get(requests.GET_MOIM_INFO(data));
    return thunkAPI.fulfillWithValue(response.data);
  },
);

const moimInfo = createSlice({
  name: 'moimDetail',
  initialState,
  // 동기 action
  reducers: {},
  // 비동기 action
  extraReducers: builder => {
    builder.addCase(getMoimInfo.pending, state => {
      console.log('pending');
    });
    builder.addCase(getMoimInfo.fulfilled, (state, action) => {
      state.moimId = action.payload.moimId;
      state.name = action.payload.name;
      state.placeName = action.payload.placeName;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.date = action.payload.date;
      state.time = action.payload.time;
      state.lateFee = action.payload.lateFee;
      state.members = [...action.payload.members];
      console.log('fulfilled');
    });
    builder.addCase(getMoimInfo.rejected, (state, action) => {
      console.log('reject', action.error);
    });
  },
});

export default moimInfo;
