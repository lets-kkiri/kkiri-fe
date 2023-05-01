import React from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Icons
// import Notifi from '../assets/icons/notification.svg';
// import Setting_icon from '../assets/icons/setting.svg';
const Notifi = require('../assets/icons/notification.svg');
const Setting_icon = require('../assets/icons/setting.svg');
const logo = require('../assets/logo.svg');

const Header = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View>
      <TouchableHighlight onPress={() => navigation.navigate('Home')}>
        <WithLocalSvg asset={logo} height={24} />
      </TouchableHighlight>
      <TouchableHighlight onPress={() => navigation.navigate('Notification')}>
        <WithLocalSvg asset={Notifi} width={24} height={24} />
      </TouchableHighlight>
      <TouchableHighlight onPress={() => navigation.navigate('Setting')}>
        <WithLocalSvg asset={Setting_icon} width={24} height={24} />
      </TouchableHighlight>
    </View>
  );
};

export default Header;
