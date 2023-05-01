import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button, Text, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View>
      <Button
        title="채팅방 입장"
        onPress={() =>
          navigation.navigate('Chatroom', {navigation: navigation, roomId: 1})
        }
      />
    </View>
  );
}

export default Home;
