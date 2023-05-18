import React from 'react';
import {View, Image, Text} from 'react-native';
import CustomButton from '../Common/Button';
import {WithLocalSvg} from 'react-native-svg';
import Bear from '../../assets/icons/bear.svg';
import styled from 'styled-components/native';

interface BtnProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  overall: number;
  ranking: number;
  destinationTime: string;
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

const Margin = styled.View`
  width: 300px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
`;

const MainFont = styled.Text`
  font-size: 14;
  font-weight: 600;
  color: #5968f2;
`;

const SubFont = styled.Text`
  font-size: 12;
`;

const ArriveNoti = ({
  setModalVisible,
  overall,
  ranking,
  destinationTime,
}: BtnProps) => {
  const currentTime = new Date(); // 현재 시간
  const targetDate = new Date(destinationTime); // 특정 시간

  // 시간 차이 계산 (밀리초 단위)
  const timeDifference = targetDate.getTime() - currentTime.getTime();
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  console.log(timeDifference, minutesDifference);
  return (
    <Container>
      <Inner>
        <WithLocalSvg asset={Bear} style={{marginRight: 10}} />
        <MainFont>목적지에 도착했습니다</MainFont>
      </Inner>
      <Hr />
      <Margin>
        <SubFont>
          유저님은 {overall}명 중 {ranking}등으로 도착했어요!
        </SubFont>
        <SubFont>약속 시간까지 아직 {timeDifference}분 남았어요!</SubFont>
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
