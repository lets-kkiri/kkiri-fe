import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {baseInstance} from '../api/axios';
import {requests} from '../api/requests';

interface helpProps {
  senderEmail: string;
  chatRoomId: string;
}

const initialState: helpProps = {
  senderEmail: '',
  chatRoomId: '',
};

export const helpPost = createAsyncThunk(
  'help/post',
  async (data: helpProps) => {
    const response = await baseInstance.post(requests.POST_HELP(), data);
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

export default helpSlice.reducer;
