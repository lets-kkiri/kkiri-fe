import {combineReducers} from 'redux';

import guidesSlice from '../slices/guidesSlice';
import arriveSlice from '../slices/arriveSlice';
import markSlice from '../slices/markSlice';
import pressSlice from '../slices/pressSlice';
import helpSlice from '../slices/helpSlice';

const rootReducer = combineReducers({
  guides: guidesSlice,
  arrives: arriveSlice,
  marks: markSlice,
  press: pressSlice,
  help: helpSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
