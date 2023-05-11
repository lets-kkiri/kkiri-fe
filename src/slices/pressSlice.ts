import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {baseInstance} from '../api/axios';
import {requests} from '../api/requests';

interface PressProps {
  senderEmail: string;
  receiverEmail: string;
}

const initialState: PressProps = {
  senderEmail: '',
  receiverEmail: '',
};

export const pressPost = createAsyncThunk(
  'press/post',
  async (data: PressProps) => {
    const response = await baseInstance.post(requests.POST_PRESS(), data);
    return response.data;
  },
);

const pressSlice = createSlice({
  name: 'press',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(pressPost.pending, state => {
      console.log('pending');
    });
    builder.addCase(pressPost.fulfilled, (state, action) => {
      console.log('fulfilled');
    });
    builder.addCase(pressPost.rejected, (state, action) => {
      console.log('reject', action.error);
    });
  },
});

export default pressSlice;
