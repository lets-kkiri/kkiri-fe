import React from 'react';
import {View, Text} from 'react-native';

function Chatroom({navigation, route}) {
  const roomId = route.params.roomId;
  return (
    <View>
      <Text>{roomId}</Text>
    </View>
  );
}

export default Chatroom;
