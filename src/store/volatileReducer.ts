import {combineReducers} from 'redux';

import moimSlice from '../slices/moim';
import moimInfoSlice from '../slices/moimInfo';

const volatileReducer = combineReducers({
  moim: moimSlice.reducer,
  moimInfo: moimInfoSlice.reducer,
});

export type VolatileState = ReturnType<typeof volatileReducer>;
export default volatileReducer;
