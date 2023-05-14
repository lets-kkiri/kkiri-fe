import React from 'react';

// hooks
import usePermissions from './src/hooks/usePermissions';

// redux
import store, {persistor} from './src/store';
import {Provider} from 'react-redux';
import AppInner from './AppInner';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

// FCM 및 푸쉬 알림
import {PersistGate} from 'redux-persist/integration/react';

function App() {
  usePermissions();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppInner />
      </PersistGate>
    </Provider>
  );
}

export default App;
