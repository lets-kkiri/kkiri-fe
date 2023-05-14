import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

function Setting() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View>
      <Button
        title="채팅방 입장"
        onPress={() => navigation.navigate('Chatroom', {moimId: 9})}
      />
      <Button title="지도" onPress={() => navigation.navigate('Map')} />
    </View>
  );
}

export default Setting;
