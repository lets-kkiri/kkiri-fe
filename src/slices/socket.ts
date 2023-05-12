import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
  moimId: 0,
  socket: '',
};

export const socketConnect = createAsyncThunk(
  'sockets/connect',
  async (data: number, thunkAPI) => {
    const response = await JSON.stringify(
      new WebSocket(`wss://k8a606.p.ssafy.io/ws/api/${data}`),
    );
    return thunkAPI.fulfillWithValue(response);
  },
);

const socketsSlice = createSlice({
  name: 'sockets',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(socketConnect.pending, state => {
      console.log('pending');
    });
    builder.addCase(socketConnect.fulfilled, (state, action) => {
      console.log('fulfilled');
      console.log('웹소켓 연결되어라 제발');
      state.socket = action.payload;
    });
    builder.addCase(socketConnect.rejected, (state, action) => {
      console.log('reject', action.error);
    });
  },
});

export default socketsSlice;
