import React from 'react';
import {Animated, Text} from 'react-native';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';

// svg
import Draw from '../../assets/icons/draw.svg';

const Container = styled(Animated.View)`
  position: absolute;
  flex-direction: row;
  justify-content: center;
`;

const Inner = styled.View`
  width: 300px;
  justify-content: center;
  padding: 0 27px;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  background-color: #dde2fc;
`;

const Button = styled.TouchableOpacity`
  width: 70px;
  height: 85px;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  background-color: #fff;
`;

const Font = styled.Text`
  color: #5968f2;
  font-weight: bold;
`;

interface NotiProps {
  mainTitle: string;
  subTitle: string;
  onPress: () => void;
}

const NotiBox = ({mainTitle, subTitle, onPress}: NotiProps) => {
  return (
    <Container>
      <Inner>
        <Font>{mainTitle}</Font>
        <Text style={{fontSize: 12}}>{subTitle}</Text>
      </Inner>
      <Button activeOpacity={0.8} onPress={onPress}>
        <WithLocalSvg asset={Draw} width={30} height={30} />
        <Font
          style={{
            fontSize: 10,
            marginTop: 4,
          }}>
          START
        </Font>
      </Button>
    </Container>
  );
};

export default NotiBox;
