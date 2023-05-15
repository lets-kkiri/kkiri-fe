import React from 'react';
import {View} from 'react-native';
import CustomButton from '../Common/Button';
import {WithLocalSvg} from 'react-native-svg';

import Destination from '../../assets/icons/destination.svg';
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

const MainFont = styled.Text`
  font-size: 14;
  font-weight: 600;
  color: #5968f2;
`;

const SubFont = styled.Text`
  font-size: 12;
`;

const Margin = styled.View`
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
`;

const SendPathNoti = ({setModalVisible}: BtnProps) => {
  return (
    <Container>
      <Inner>
        <WithLocalSvg asset={Destination} style={{marginRight: 10}} />
        <MainFont>길안내 알림을 전송했어요!</MainFont>
      </Inner>
      <Hr />
      <Margin>
        <SubFont>실시간 끼리 맵을 통해 친구가 무사히 오고 있는지</SubFont>
        <SubFont>틈틈히 확인해주세요!</SubFont>
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

export default SendPathNoti;
