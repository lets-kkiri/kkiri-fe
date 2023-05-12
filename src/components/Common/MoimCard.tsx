import React from 'react';
import {View, Text} from 'react-native';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';

// svg
import Cash from '../../assets/icons/cash.svg';
import Time from '../../assets/icons/time.svg';
import People from '../../assets/icons/people.svg';

const Container = styled.View`
  width: 290px;
  height: 310px;
  background-color: #5968f2;
  border-radius: 15px;
  padding: 30px 25px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const DDay = styled.View`
  width: 55px;
  height: 30px;
  background-color: #f7ffd2;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const DayFont = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #5968f2;
`;

const MainFont = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-top: 10px;
`;

const SubFont = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: #e9e9e9;
  margin-left: 15px;
`;

const MoimCard = () => {
  return (
    <Container>
      <Row style={{justifyContent: 'space-between'}}>
        <DDay>
          <DayFont>D-10</DayFont>
        </DDay>
        <WithLocalSvg asset={Cash} />
      </Row>
      <MainFont>4월 20일</MainFont>
      <View style={{height: 120, justifyContent: 'space-between', marginTop: 30}}>
        <Row>
          <WithLocalSvg asset={Time} />
          <SubFont>모임 이름 텍스트</SubFont>
        </Row>
        <Row>
          <WithLocalSvg asset={People} />
          <SubFont>오후 6시</SubFont>
        </Row>
        <Row>
          <WithLocalSvg asset={Time} />
          <SubFont>서울특별시 용산구</SubFont>
        </Row>
        <Row>
          <WithLocalSvg asset={People} />
          <SubFont>6명</SubFont>
        </Row>
      </View>
    </Container>
  );
};

export default MoimCard;
