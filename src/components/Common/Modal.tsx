import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import Modal from 'react-native-modal';

interface ModalProps {
  modalVisible: boolean;
  content: JSX.Element;
  // onClick: () => void;
}

const CustomModal = ({modalVisible, content}: ModalProps) => {
  return (
    <Modal
      isVisible={modalVisible}
      coverScreen={true}
      hasBackdrop={true}
      backdropColor="#F8F9FF"
      style={styles.modal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>{content}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    paddingHorizontal: 16,
  },
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
