import {combineReducers} from 'redux';

import userSlice from '../slices/user';
import notiSlice from '../slices/noti';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  noti: notiSlice.reducer,
});

export type PersistedRootState = ReturnType<typeof rootReducer>;
export default rootReducer;
