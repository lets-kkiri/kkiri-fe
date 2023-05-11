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
  reducers: {
    // createSocket: (state, action) => {
    // const moimId = action.payload.moimId;
    // const newSocket = JSON.stringify(
    //   new WebSocket(`wss://k8a606.p.ssafy.io/ws/api/${moimId}`),
    // );
    // state.socket = newSocket;
    // },
    // removeSocket: (state, action) => {
    //   const {id} = action.payload;
    //   delete state[id];
    // },
  },
  extraReducers: builder => {
    builder.addCase(socketConnect.pending, state => {
      console.log('pending');
    });
    builder.addCase(socketConnect.fulfilled, (state, action) => {
      console.log('fulfilled');
      state.socket = action.payload;
    });
    builder.addCase(socketConnect.rejected, (state, action) => {
      console.log('reject', action.error);
    });
  },
});

export default socketsSlice;
