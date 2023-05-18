import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authInstance, baseInstance} from '../api/axios';
import {requests} from '../api/requests';

interface ArriveProps {
  moimId: number;
  destinationTime: string;
}

type ArriveType = {
  moimId: number;
  kakaoId: string;
  destinationTime: string;
  rank: number;
  overall: number;
};

const initialState: ArriveType[] = [];

export const arrivePost = createAsyncThunk(
  'arrives/post',
  async (data: ArriveProps, thunkAPI) => {
    const response = await authInstance.post(requests.POST_ARRIVE(), data);
    return thunkAPI.fulfillWithValue(response.data);
  },
);

const arriveSlice = createSlice({
  name: 'arrives',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(arrivePost.pending, state => {
      console.log('pending');
    });
    builder.addCase(arrivePost.fulfilled, (state, action) => {
      console.log('fulfilled');
      console.log('유저 도착 순서 : ', action.payload);
      state.unshift({
        moimId: action.payload.moimId,
        kakaoId: action.payload.kakaoId,
        destinationTime: action.payload.destinationTime,
        rank: action.payload.ranking.rank,
        overall: action.payload.ranking.overall,
      });
    });
    builder.addCase(arrivePost.rejected, (state, action) => {
      console.log('reject', action.error);
    });
  },
});

export default arriveSlice;
