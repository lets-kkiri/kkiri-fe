import React from 'react';
import {View, Image, Text} from 'react-native';
import CustomButton from '../Common/Button';
import { WithLocalSvg } from 'react-native-svg';
import Bear from '../../assets/icons/bear.svg';
import styled from 'styled-components/native';

interface BtnProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Container = styled.View`
  width: 100%;
`;

const Inner = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
`;

const Hr = styled.View`
  border-bottom-width: 1;
  border-bottom-color: #b0bdff;
  margin: 10px 0;
`;

const Margin = styled.View`
  width: 300;
  margin-left: 10;
  margin-right: 10;
  margin-top: 5;
  margin-bottom: 5;
  padding-left: 10;
  padding-right: 10;
`;

const MainFont = styled.Text`
  font-size: 14;
  font-weight: 600;
  color: #5968f2;
`;

const SubFont = styled.Text`
  font-size: 12;
`;

const ArriveNoti = ({setModalVisible}: BtnProps) => {
  return (
    <Container>
      <Inner>
        <WithLocalSvg asset={Bear} style={{marginRight: 10}} />
        <MainFont>목적지에 도착했습니다</MainFont>
      </Inner>
      <Hr />
      <Margin>
        <SubFont>유저님은 5명 중 2등으로 도착했어요!</SubFont>
        <SubFont>약속 시간까지 아직 10분 남았어요!</SubFont>
      </Margin>
      <View style={{alignItems: 'flex-end'}}>
        <CustomButton
          text="확인"
          status="blur"
          width="tiny"
          onPress={() => setModalVisible(false)}
        />
      </View>
    </Container>
  );
};

export default ArriveNoti;
