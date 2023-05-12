import React from 'react';
import {Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList} from '../types';

interface MoimProps {
  navigation: StackNavigationProp<RootStackParamList, 'Moim'>;
  route: RouteProp<RootStackParamList, 'Moim'>;
}

function Moim({navigation, route}: MoimProps) {
  const moimId = route.params.moimId;

  return (
    <View>
      <Text>{moimId}번 모임입니다.</Text>
    </View>
  );
}

export default Moim;
