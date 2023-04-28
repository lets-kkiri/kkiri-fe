import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/pages/Home';
import CreateMoim from './src/pages/CreateMoim';
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
        <Tab.Screen name="Home" component={Home} options={{title: '홈'}} />
        <Tab.Screen
          name="Create"
          component={CreateMoim}
          options={{title: ''}}
        />
        <Tab.Screen
          name="Mypage"
          component={Home}
          options={{title: '마이페이지'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
