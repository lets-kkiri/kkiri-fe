import {combineReducers} from 'redux';

import guidesSlice from '../slices/guidesSlice';
import arriveSlice from '../slices/arriveSlice';

const rootReducer = combineReducers({
  guides: guidesSlice,
  arrives: arriveSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
