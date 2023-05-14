import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';

interface ModalProps {
  modalVisible: boolean;
  content: JSX.Element;
}

const CenteredView = styled.View`
  justify-content: center;
  align-items: center;
`;

const ModalView = styled.View`
  margin: 20px;
  background-color: white;
  border-radius: 15;
  border-color: #5968f2;
  border-style: solid;
  border-width: 2;
  padding-right: 10;
  padding-left: 10;
  padding-top: 20;
  padding-bottom: 10;
`;

const CustomModal = ({modalVisible, content}: ModalProps) => {
  return (
    <Modal
      isVisible={modalVisible}
      coverScreen={true}
      hasBackdrop={true}
      backdropColor="#F8F9FF">
      <CenteredView>
        <ModalView>{content}</ModalView>
      </CenteredView>
    </Modal>
  );
};

export default CustomModal;
