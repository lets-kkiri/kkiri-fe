import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import CreateMoim from '../pages/CreateMoim';
import MyPage from '../pages/MyPage';
import SignIn from '../pages/SignIn';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';
import {TouchableOpacity} from 'react-native';
import CompleteCreate from './CreateMoim/CompleteCreate';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

// Tab Icons
const home_active = require('../assets/tabIcons/home_active.svg');
const home_inactive = require('../assets/tabIcons/home_inactive.svg');
const mypage_active = require('../assets/tabIcons/mypage_active.svg');
const mypage_inactive = require('../assets/tabIcons/mypage_inactive.svg');

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const theme = useSelector((state: RootState) => state.persisted.theme.theme);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === 'Home') {
            return (
              <WithLocalSvg asset={focused ? home_active : home_inactive} />
            );
          }
          if (route.name === 'Mypage') {
            return (
              <WithLocalSvg asset={focused ? mypage_active : mypage_inactive} />
            );
          }
        },
        headerShown: false,
        tabBarActiveTintColor: '#5968F2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 68,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 8,
          paddingBottom: 8,
          elevation: 0,
          borderTopWidth: 0,
          backgroundColor: theme.color.background,
        },
        tabBarLabelStyle: {
          fontSize: 8,
        },
      })}>
      <Tab.Screen name="Home" component={Home} options={{tabBarLabel: '홈'}} />
      <Tab.Screen
        name="Create"
        component={CreateMoim}
        options={({navigation}) => ({
          tabBarButton: props => (
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateMoim')}
              activeOpacity={0.6}>
              <WithLocalSvg
                asset={require('../assets/tabIcons/moim_create.svg')}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Mypage"
        component={MyPage}
        options={{tabBarLabel: '마이페이지'}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
