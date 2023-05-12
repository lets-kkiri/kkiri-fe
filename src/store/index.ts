import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import rootReducer, {PersistedRootState} from './reducer';

import volatileReducer, {VolatileState} from './volatileReducer';

// persist 처리를 위한 코드
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'noti'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const combinedReducer = combineReducers({
  persisted: persistedReducer,
  volatile: volatileReducer,
});

const store = configureStore({
  reducer: combinedReducer,
  // reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const defaultMiddleware = getDefaultMiddleware({
      serializableCheck: {
        // Allow non-serializable values in the `persist/PERSIST` action type
        ignoredActions: ['persist/PERSIST'],
      },
    });

    if (__DEV__) {
      const createDebugger = require('redux-flipper').default;
      return defaultMiddleware.concat(createDebugger());
    }
    return defaultMiddleware;
  },
});

export const persistor = persistStore(store);
export default store;

// TS를 위한 코드
export type RootState = {
  persisted: PersistedRootState;
  volatile: VolatileState;
};
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
