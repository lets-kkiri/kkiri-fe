import * as React from 'react';

// hooks
import usePermissions from './src/hooks/usePermissions';

// redux
import store, {persistor} from './src/store';
import {Provider} from 'react-redux';
import AppInner from './AppInner';

// FCM 및 푸쉬 알림
import messaging from '@react-native-firebase/messaging';
import {PersistGate} from 'redux-persist/integration/react';

function App() {
  usePermissions();

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppInner />
      </PersistGate>
    </Provider>
  );
}

export default App;
