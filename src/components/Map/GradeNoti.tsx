import React from 'react';
import {View, Image, Text} from 'react-native';
import styled from 'styled-components/native';
import CustomButton from '../Common/Button';
import {WithLocalSvg} from 'react-native-svg';
import Bear from '../../assets/icons/bear.svg';

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
  border-bottom-width: 1px;
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
  width: 300px;
`;

const GradeNoti = ({setModalVisible}: BtnProps) => {
  return (
    <Container>
      <Inner>
        <WithLocalSvg asset={Bear} style={{marginRight: 10}} />
        <MainFont>모임원이 모두 도착했어요!</MainFont>
      </Inner>
      <Hr />
      <Margin>
        <SubFont>오늘 모임의 친구들과</SubFont>
        <SubFont>재미난 하루 보내세요!</SubFont>
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

export default GradeNoti;
