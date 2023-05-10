import React from 'react';
import {View, Image, Text, Button, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import ShortButton from './Button/ShortButton';
import LongButton from './Button/LongButton';

interface ModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomModal = ({modalVisible, setModalVisible}: ModalProps) => {
  return (
    <Modal
      isVisible={modalVisible}
      coverScreen={true}
      hasBackdrop={true}
      backdropColor="#F8F9FF">
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../assets/icons/bear.png')}
              style={{width: 30, height: 33, marginRight: 10}}
            />
            <Text>목적지에 도착했습니다</Text>
          </View>
          <View 
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#B0BDFF",
              marginVertical: 10,
            }}
          />
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <View style={{marginRight: 20, marginVertical: 5}}>
              <Text style={{fontSize: 12}}>
                유저님은 5명 중 2등으로 도착했어요!
              </Text>
              <Text style={{fontSize: 12}}>
                약속 시간까지 아직 10분 남았어요!
              </Text>
            </View>
            {/* <Button onPress={() => setModalVisible(false)} title="확인" /> */}
            <ShortButton text="확인" />
          </View>
          <LongButton text="확인해따" />
        </View>
      </View>
    </Modal>
  );
};

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
    borderColor: '#5968F2',
    borderStyle: 'solid',
    borderWidth: 2,
    padding: 20,
    elevation: 5,
  },
});

export default CustomModal;
