import React from 'react';
import {Text, View} from 'react-native';

function Home() {
  return (
    <View>
      <Button
        title="채팅방 입장"
        onPress={() => navigation.navigate('Chatroom', {roomId: 1})}
      />
    </View>
  );
}

export default Home;
