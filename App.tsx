import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/pages/Home';
// import {useState} from 'react';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  // const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Orders"
          component={Home}
          options={{title: 'Home Page'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
