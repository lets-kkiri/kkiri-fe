import {combineReducers} from 'redux';

import moimSlice from '../slices/moim';

const volatileReducer = combineReducers({
  moim: moimSlice.reducer,
});

export type VolatileState = ReturnType<typeof volatileReducer>;
export default volatileReducer;
