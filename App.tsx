import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Page
import Setting from './src/pages/Setting';
import Notification from './src/pages/Notification';

// Components
import Header from './src/components/Header';
import TabNavigator from './src/components/TabNavigator';

// Types
import {RootStackParamList} from './src/types';
import Chatroom from './src/pages/Chatroom';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  // const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={{header: () => <Header />}}
        />
        <Stack.Screen
          name="Setting"
          component={Setting}
          options={{title: '세팅'}}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{title: '알림센터'}}
        />
        <Stack.Screen
          name="Chatroom"
          component={Chatroom}
          options={{title: '채팅방'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
