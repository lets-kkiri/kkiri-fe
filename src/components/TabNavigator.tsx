import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import CreateMoim from '../pages/CreateMoim';
import MyPage from '../pages/MyPage';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Create" component={CreateMoim} />
      <Tab.Screen name="Mypage" component={MyPage} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
