import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authInstance, baseInstance} from '../api/axios';
import {requests} from '../api/requests';

interface ArriveProps {
  moimId: number;
  destinationTime: string;
}

const initialState = {
  userGrade: {
    moimId: 0,
    kakaoId: '',
    destinationTime: '',
    ranking: {
      rank: 0,
      overall: 0,
    },
  },
};

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
      state.userGrade = action.payload;
    });
    builder.addCase(arrivePost.rejected, (state, action) => {
      console.log('reject', action.error);
    });
  },
});

export default arriveSlice;
