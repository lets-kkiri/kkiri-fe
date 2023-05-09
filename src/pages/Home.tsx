import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Button, Text, View, Modal, StyleSheet, Image} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

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
      <Modal
        visible={modalVisible}
        transparent={true}
        presentationStyle={'formSheet'}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/icons/bear.png')}
                style={{width: 30, height: 33}}
              />
              <Text style={styles.modalText}>목적지에 도착했습니다</Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <View style={{marginRight: 20}}>
                <Text>님은 5명 중 2등으로 도착했어요!</Text>
                <Text>약속 시간까지 아직 10분 남았어요!</Text>
              </View>
              <Button onPress={() => setModalVisible(false)} title="확인" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
  },
});

export default Home;
