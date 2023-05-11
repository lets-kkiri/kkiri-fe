import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';

// svg
import Draw from '../../assets/icons/draw.svg';

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 20;
`;

const Inner = styled.View`
  justify-content: center;
  padding: 0 27px;
  border-top-left-radius: 15;
  border-bottom-left-radius: 15;
  background-color: #dde2fc;
`;

const Button = styled.TouchableOpacity`
  width: 70;
  height: 85;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 15;
  border-bottom-right-radius: 15;
  background-color: #fff;
`;

const Font = styled.Text`
  color: #5968f2;
  font-weight: bold;
`;

interface NotiProps {
  mainTitle: string;
  subTitle: string;
}

const NotiBox = ({mainTitle, subTitle}: NotiProps) => {
  return (
    <Container>
      <Inner>
        <Font>{mainTitle}</Font>
        <Text style={{fontSize: 12}}>{subTitle}</Text>
      </Inner>
      <Button activeOpacity={0.8}>
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
