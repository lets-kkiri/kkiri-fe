import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import styled from 'styled-components/react-native';
import {View} from 'react-native';

// Page
import Setting from './src/pages/Setting';
import Notification from './src/pages/Notification';
import Map from './src/pages/Map';

// Components
import Header from './src/components/Header';
import TabNavigator from './src/components/TabNavigator';

// Types
import {RootStackParamList} from './src/types';
import Chatroom from './src/pages/Chatroom';
import CreateMoim from './src/pages/CreateMoim';
import * as React from 'react';

// hooks
import usePermissions from './src/hooks/usePermissions';

// redux
import store, {persistor} from './src/store';
import {Provider} from 'react-redux';
import AppInner from './AppInner';
// Theme
import {lightTheme, darkTheme} from './src/styles/theme';
import {ThemeProvider} from 'styled-components';
import {GlobalStyle} from './src/styles/globalStyle';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

// FCM 및 푸쉬 알림
import {PersistGate} from 'redux-persist/integration/react';

function App() {
  // const [isLoggedIn, setLoggedIn] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const currentTheme = isDark ? darkTheme : lightTheme;

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
