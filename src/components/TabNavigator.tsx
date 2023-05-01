import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import CreateMoim from '../pages/CreateMoim';
import MyPage from '../pages/MyPage';
import styled from 'styled-components/native';
import {Image} from 'react-native';

// Tab Icons
const tabIcons = {
  home: {
    inactive: require('../assets/tabIcons/home_inactive.svg'),
    active: require('../assets/tabIcons/home_active.svg'),
  },
  myPage: {
    inactive: require('../assets/tabIcons/mypage_inactive.svg'),
    active: require('../assets/tabIcons/mypage_active.svg'),
  },
};

const Tab = createBottomTabNavigator();

const TabContainer = styled(Tab.Navigator)`
  height: 86px;
  background-color: black;
`;

const TabScreen = styled(Tab.Screen)``;

const TabNavigator = () => {
  return (
    <TabContainer
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? tabIcons.home.active : tabIcons.home.inactive;
          } else if (route.name === 'Mypage') {
            iconName = focused
              ? tabIcons.myPage.active
              : tabIcons.myPage.inactive;
          }
          return <Image source={iconName} />;
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Create" component={CreateMoim} />
      <Tab.Screen name="Mypage" component={MyPage} />
    </TabContainer>
  );
};

export default TabNavigator;
