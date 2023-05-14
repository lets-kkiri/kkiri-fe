import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

interface ButtonProps {
  text: string;
  status: StatusType;
  width: WidthType;
  onPress: () => void;
}

type StatusType = 'active' | 'disabled' | 'blur' | 'kakao';
type WidthType = 'tiny' | 'short' | 'long';
type BtnStatusType = {
  [index: string]: object;
  tiny: object;
  short: object;
  long: object;
  active: object;
  disabled: object;
  blur: object;
  kakao: object;
};

const btnStatus: BtnStatusType = {
  tiny: {
    width: 100,
  },
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
  kakao: {
    backgroundColor: '#DCF861',
  },
};

const Button = styled.View`
  height: 50;
  justify-content: center;
  align-items: center;
  padding-left: 34;
  padding-right: 34;
  border-radius: 15;
  background-color: #5968f2;
`;

const Font = styled.Text`
  color: #fff;
  font-size: 14;
`;

const CustomButton = ({text, status, width, onPress}: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Button style={StyleSheet.flatten([btnStatus[status], btnStatus[width]])}>
        <Font>{text}</Font>
      </Button>
    </TouchableOpacity>
  );
};

export default CustomButton;
