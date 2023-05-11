import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {io, Socket} from 'socket.io-client';

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

type socket = Socket<ServerToClientEvents, ClientToServerEvents>;

const socketsSlice = createSlice({
  name: 'sockets',
  initialState: {},
  reducers: {
    addSocket: (state, action) => {
      const {id, socket} = action.payload;
      state[id] = socket;
    },
    removeSocket: (state, action) => {
      const {id} = action.payload;
      delete state[id];
    },
  },
});

export const {addSocket, removeSocket} = socketsSlice.actions;

export const createSocket = (moimId: number) => (dispatch: any) => {
  const socket = io(`wss://k8a606.p.ssafy.io/ws/api/${moimId}`);
  dispatch(addSocket({moimId, socket}));
};

export default socketsSlice.reducer;
