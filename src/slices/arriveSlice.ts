import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {baseInstance} from '../api/axios';
import {requests} from '../api/requests';
import {RootState} from '../store/reducer';

interface ArriveProps {
  roomId: number;
  memberId: number;
  arrivalTime: string;
}

const initialState = {
  userGrade: {
    roomId: 0,
    memberId: 0,
    arrivalTime: '',
    grade: 0,
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

export const userGrade = (state: RootState) => state.arrives.userGrade;

export default arriveSlice.reducer;
