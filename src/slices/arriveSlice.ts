import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {baseInstance} from '../api/axios';
import {requests} from '../api/requests';

interface ArriveProps {
  roomId: number;
  memberId: number;
  arrivalTime: string;
}

const initialState: ArriveProps = {
  roomId: 0,
  memberId: 0,
  arrivalTime: '',
};

export const arrivePost = createAsyncThunk(
  'arrives/post',
  async (data: ArriveProps) => {
    const response = await baseInstance.post(requests.POST_ARRIVE(), data);
    return response.data;
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
    });
    builder.addCase(arrivePost.rejected, (state, action) => {
      console.log('reject', action.error);
    });
  },
});

export default arriveSlice.reducer;
