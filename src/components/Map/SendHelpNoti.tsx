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
  width: 300;
`;

const SendHelpNoti = ({setModalVisible}: BtnProps) => {
  return (
    <Container>
      <Inner>
        <WithLocalSvg asset={Bear} style={{marginRight: 10}} />
        <MainFont>도움을 요청했어요!</MainFont>
      </Inner>
      <Hr />
      <Margin>
        <SubFont>친구가 길을 그리면</SubFont>
        <SubFont>알림을 통해 알려드려요!</SubFont>
      </Margin>
      <View style={{alignItems: 'flex-end'}}>
        <CustomButton
          text="확인"
          status="blur"
          // width="short"
          onPress={() => setModalVisible(false)}
        />
      </View>
    </Container>
  );
};

export default SendHelpNoti;
