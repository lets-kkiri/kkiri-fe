import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Button, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomModal from '../components/Common/Modal';
import SendPathNoti from '../components/Common/SendPathNoti';
import ArriveNoti from '../components/Common/ArriveNoti';

function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <Button
        title="채팅방 입장"
        onPress={() => navigation.navigate('Chatroom', {roomId: 1})}
      />
      <Button title="지도" onPress={() => navigation.navigate('Map')} />
      <Button
        title="모임원 위치"
        onPress={() => navigation.navigate('RealtimeLocation')}
      />
      <Button title="모달" onPress={() => setModalVisible(true)} />
      <CustomModal
        modalVisible={modalVisible}
        content={<ArriveNoti setModalVisible={setModalVisible} />}
      />
    </View>
  );
}

export default Home;
