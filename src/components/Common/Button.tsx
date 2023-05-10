import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

interface ButtonProps {
  text: string;
  status: StatusType;
  width: WidthType;
  onPress: () => void;
}

type StatusType = 'active' | 'disabled' | 'blur';
type WidthType = 'short' | 'long';
type BtnStatusType = {
  [index: string]: object;
  short: object;
  long: object;
  active: object;
  disabled: object;
  blur: object;
};

const btnStatus: BtnStatusType = {
  short: {
    width: 165,
  },
  long: {
    width: 343,
  },
  active: {
    backgroundColor: '#5968F2',
  },
  disabled: {
    backgroundColor: '#D0D0D0',
  },
  blur: {
    backgroundColor: '#B0BDFF',
  },
};

const CustomButton = ({text, status, width, onPress}: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={StyleSheet.flatten([
          styles.button,
          btnStatus[status],
          btnStatus[width],
        ])}>
        <Text style={styles.font}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 34,
    borderRadius: 15,
    backgroundColor: '#5968F2',
  },
  font: {
    color: '#5968F2',
  },
});

export default CustomButton;
