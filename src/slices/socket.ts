import {createSlice} from '@reduxjs/toolkit';
import {io, Socket} from 'socket.io-client';

interface SocketState {
  moimId: number;
  socket: Socket;
}

const initialState: SocketState = {
  moimId: 0,
  socket: io('/'),
};

const socketsSlice = createSlice({
  name: 'sockets',
  initialState,
  reducers: {
    createSocket: (state, action) => {
      const moimId = action.payload.moimId;
      const newSocket = io(`wss://k8a606.p.ssafy.io/ws/api/${moimId}`);
      return {...state, newSocket};
    },
    // removeSocket: (state, action) => {
    //   const {id} = action.payload;
    //   delete state[id];
    // },
  },
});

export default socketsSlice;
