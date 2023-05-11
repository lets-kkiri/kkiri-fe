import {combineReducers} from 'redux';

import userSlice from '../slices/user';
import notiSlice from '../slices/noti';
import socketsSlice from '../slices/socket';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  noti: notiSlice.reducer,
  socket: socketsSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
