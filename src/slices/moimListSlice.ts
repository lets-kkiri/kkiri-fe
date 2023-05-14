import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authInstance, baseInstance} from '../api/axios';
import {requests} from '../api/requests';

const initialState = {
  moimlist: [],
};

// export const getMoimlist = createAsyncThunk(
//   'moimlist/get/all',
//   async thunkAPI => {
//     const response = await authInstance.get(requests.GET_MOIM_LIST());
//     return thunkAPI.fulfillWithValue(response.data);
//   },
// );

const moimListSlice = createSlice({
  name: 'moimList',
  initialState,
  reducers: {},
  // extraReducers: builder => {
  //   builder.addCase(getMoimlist.pending, state => {
  //     console.log('moimListAPI :', 'pending');
  //   });
  //   builder.addCase(getMoimlist.fulfilled, (state, action) => {
  //     console.log('moimListAPI :', 'fulfilled');
  //     state.moimlist = action.payload;
  //   });
  //   builder.addCase(getMoimlist.rejected, state => {
  //     console.log('moimListAPI :', 'rejected');
  //   });
  // },
});

export default moimListSlice;
