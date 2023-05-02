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

// hooks
import usePermissions from './src/hooks/usePermissions';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

// export type RootStackParamList = {
//   SignIn: undefined;
//   SignUp: undefined;
// };

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  // const [isLoggedIn, setLoggedIn] = useState(false);
  usePermissions();
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
