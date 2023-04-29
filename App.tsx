import * as React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/pages/Home';
import CreateMoim from './src/pages/CreateMoim';
import MyPage from './src/pages/MyPage';
import {Button, Text, View, Image, TouchableHighlight} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';

// Icons
import Notifi from './src/assets/icons/notification.svg';
import Setting_icon from './src/assets/icons/setting.svg';

// Page
import Setting from './src/pages/Setting';
import Notification from './src/pages/Notification';

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

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Create" component={CreateMoim} />
      <Tab.Screen name="Mypage" component={MyPage} />
    </Tab.Navigator>
  );
};

const Header = () => {
  const navigation = useNavigation();

  const moveToNotifi = () => {
    navigation.navigate('Notification');
  };

  const moveToSetting = () => {
    navigation.navigate('Setting');
  };
  return (
    <View>
      <Text>끼리</Text>
      <TouchableHighlight onPress={() => alert('notifi')}>
        <WithLocalSvg asset={Notifi} width={24} height={24} />
      </TouchableHighlight>
      <TouchableHighlight>
        <WithLocalSvg asset={Setting_icon} width={24} height={24} />
      </TouchableHighlight>
    </View>
  );
};

const Stack = createNativeStackNavigator();
function App() {
  // const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="끼리"
          component={TabNavigator}
          options={{header: () => <Header />}}
        />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="Notification" component={Notification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
