import React from 'react';
import {Modal, View, Text, Button} from 'react-native';

interface AlertProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
}

const CustomAlert = ({visible, title, message, onCancel}: AlertProps) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View>
        <Text>{title}</Text>
        <Text>{message}</Text>
        <Button title="확인" onPress={onCancel} />
      </View>
    </Modal>
  );
};

export default CustomAlert;
