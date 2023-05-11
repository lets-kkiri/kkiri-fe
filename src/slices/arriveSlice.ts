import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {baseInstance} from '../api/axios';
import {requests} from '../api/requests';

interface ArriveProps {
  moimId: number;
  arrivalTime: string;
}

const initialState = {
  userGrade: {
    moimId: 0,
    kakaoId: 0,
    arrivalTime: '',
    ranking: {
      rank: 0,
      overall: 0,
    },
  },
};

export const arrivePost = createAsyncThunk(
  'arrives/post',
  async (data: ArriveProps, thunkAPI) => {
    const response = await baseInstance.post(requests.POST_ARRIVE(), data);
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
      state.userGrade = action.payload;
    });
    builder.addCase(arrivePost.rejected, (state, action) => {
      console.log('reject', action.error);
    });
  },
});

export default arriveSlice;