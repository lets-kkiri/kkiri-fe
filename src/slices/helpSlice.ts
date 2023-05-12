import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authInstance, baseInstance} from '../api/axios';
import {requests} from '../api/requests';

interface helpProps {
  chatRoomId: number;
}

const initialState: helpProps = {
  chatRoomId: 0,
};

export const helpPost = createAsyncThunk(
  'help/post',
  async (data: helpProps) => {
    const response = await authInstance.post(requests.POST_HELP(), data);
    return response.data;
  },
);

const helpSlice = createSlice({
  name: 'help',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(helpPost.pending, state => {
      console.log('pending');
    });
    builder.addCase(helpPost.fulfilled, (state, action) => {
      console.log('fulfilled');
    });
    builder.addCase(helpPost.rejected, (state, action) => {
      console.log('reject', action.error);
    });
  },
});

export default helpSlice;
