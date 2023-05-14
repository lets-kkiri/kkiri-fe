import * as React from 'react';
import {useEffect} from 'react';

// hooks
import usePermissions from './src/hooks/usePermissions';

// redux
import store, {persistor} from './src/store';
import {Provider} from 'react-redux';
import AppInner from './AppInner';

// FCM 및 푸쉬 알림
import {PersistGate} from 'redux-persist/integration/react';
import BackgroundFetch from 'react-native-background-fetch';
import locationUpdater from './src/hooks/useLocationUpdater';

function App() {
  usePermissions();

  useEffect(() => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 1, // 최소 호출 간격(분)
        stopOnTerminate: true, // 앱이 종료되었을 때도 백그라운드 작업 계속 실행할지 여부
      },
      async taskId => {
        console.log('Background Fetch event received. TaskId:', taskId);

        await locationUpdater();

        // 작업이 성공적으로 완료되면 백그라운드 작업을 다시 등록한다.
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.log('Background Fetch configure error:', error);
      },
    );

    // 백그라운드 작업 등록 시작
    BackgroundFetch.start();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppInner />
      </PersistGate>
    </Provider>
  );
}

export default App;
