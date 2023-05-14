import React from 'react';
import {View, Text} from 'react-native';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';

// svg
import Cash from '../../assets/icons/cash.svg';
import Time from '../../assets/icons/time.svg';
import People from '../../assets/icons/people.svg';
import Day from '../../assets/icons/day.svg';

const Container = styled.View`
  width: 290px;
  height: 320px;
  background-color: #5968f2;
  border-radius: 15px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const DDay = styled.View`
  width: 43px;
  height: 23px;
  background-color: #f7ffd2;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const DayFont = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: #5968f2;
`;

const MainFont = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #dcf861;
`;

const MidFont = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #f4f4f4;
`;

const SubFont = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: #e9e9e9;
  margin-left: 10px;
`;

const MoimCard = () => {
  return (
    <Container>
      <Row
        style={{
          justifyContent: 'space-between',
          paddingVertical: 18,
          paddingHorizontal: 20,
        }}>
        <DDay>
          <DayFont>D-10</DayFont>
        </DDay>
        {/* 모임 날짜 */}
        <MainFont>4월 20일</MainFont>
        <WithLocalSvg asset={Cash} />
      </Row>
      <WithLocalSvg asset={Day} style={{left: -10, marginTop: 27}} />
      <MidFont style={{position: 'absolute', top: 170, left: 70}}>
        {/* 모임 이름 */}
        동기사랑 나라사랑
      </MidFont>
      <View>
        <Row style={{paddingHorizontal: 20, marginBottom: 10}}>
          <WithLocalSvg asset={Time} />
          {/* 모임 장소 */}
          <SubFont>서울특별시 용산구 청파동 스타벅스</SubFont>
        </Row>
        <Row style={{justifyContent: 'space-evenly', paddingHorizontal: 30}}>
          <View style={{flexDirection: 'row'}}>
            <WithLocalSvg asset={People} />
            {/* 모임 시간 */}
            <SubFont>오후 6시</SubFont>
          </View>
          <View style={{flexDirection: 'row'}}>
            <WithLocalSvg asset={People} />
            {/* 모임원 수 */}
            <SubFont>4명</SubFont>
          </View>
        </Row>
      </View>
    </Container>
  );
};

export default MoimCard;
