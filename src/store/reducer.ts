import {combineReducers} from 'redux';

import guidesSlice from '../slices/guidesSlice';
import arriveSlice from '../slices/arriveSlice';
import markSlice from '../slices/markSlice';
import pressSlice from '../slices/pressSlice';
import helpSlice from '../slices/helpSlice';
import userSlice from '../slices/user';
import notiSlice from '../slices/noti';
import socketsSlice from '../slices/socket';

const rootReducer = combineReducers({
  guides: guidesSlice.reducer,
  arrives: arriveSlice.reducer,
  marks: markSlice.reducer,
  press: pressSlice.reducer,
  help: helpSlice.reducer,
  user: userSlice.reducer,
  noti: notiSlice.reducer,
  sockets: socketsSlice.reducer,
});

export type PersistedRootState = ReturnType<typeof rootReducer>;
export default rootReducer;
