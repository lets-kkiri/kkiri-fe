import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';

// svg
import Mark from '../../assets/icons/location.svg';
import Cash from '../../assets/icons/cash.svg';
import Time from '../../assets/icons/time.svg';
import People from '../../assets/icons/people.svg';
import Day from '../../assets/icons/day.svg';
import {Moim} from '../../types';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

// Hooks
import useGetDday from '../../hooks/useGetDday';

// Styled components
const Container = styled.View<{
  width: number;
  theme: any;
  marginHorizontal: number;
}>`
  position: relative;
  width: ${({width}) => width}px;
  height: ${({width}) => width * 1.2}px;
  background-color: ${({theme}) => theme.color.blue};
  border-radius: 15px;
  padding: 20px;
  font-family: 'Pretendard-Thin';
  margin-left: ${({marginHorizontal}) => marginHorizontal}px;
  margin-right: ${({marginHorizontal}) => marginHorizontal}px;
`;

const Head = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-family: 'PretendardThin';
`;

const DDay = styled.View`
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: #f7ffd2;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const DayFont = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: #5968f2;
`;

const MainFont = styled.View`
  /* width: 120px; */
  font-size: 16px;
  font-weight: 500;
  color: #dcf861;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MidFont = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #f4f4f4;
  margin-bottom: 20px;
`;

const SubFont = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: #e9e9e9;
  margin-left: 10px;
`;

const Location = styled.View`
  display: flex;
  flex-direction: row;
  margin: 16px;
  margin-bottom: 20px;
`;

const Bottom = styled.View`
  position: relative;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// export interface Moim {
//   moimId: number;
//   name: string;
//   placeName: string;
//   data: string;
//   time: string;
//   lateFee: number;
//   members: Member[];
// }
// export interface Member {
//   kakaoId: string;
//   profileImage: string;
//   nickname: string;
// }

interface MoimCardProp {
  item: Moim;
  width: number;
  marginHorizontal: number;
}

const MoimCard = ({item, width, marginHorizontal}: MoimCardProp) => {
  const {
    moimId,
    name,
    placeName,
    date,
    time: meetingTIme,
    lateFee,
    members,
  } = item;
  const [dday, setDday] = useState<number>(0);
  const [month, setMonth] = useState<string>('12');
  const [day, setDay] = useState<string>('12');
  const [formattedTime, setFormattedTime] = useState<string>('');

  const windowWidth = Dimensions.get('window').width;

  const theme = useSelector((state: RootState) => state.persisted.theme.theme);

  const cnt = useGetDday(date);

  useEffect(() => {
    // setMonth(date.slice(5, 7));
    // setDay(date.slice(8, 10));
    const time = '12:07';
    const zone = Number(time?.slice(0, 2)) >= 12 ? '오후' : '오전';
    const hour =
      Number(time?.slice(0, 2)) >= 12
        ? Number(time?.slice(0, 2)) - 12
        : Number(time?.slice(0, 2));
    const minute = Number(time?.slice(3, 5));
    setFormattedTime(`${zone} ${hour === 0 ? 12 : hour}시 ${minute}`);
    setDday(cnt);
  }, []);

  return (
    <Container width={width} theme={theme} marginHorizontal={marginHorizontal}>
      <Head>
        <DDay>
          <DayFont>D-{dday}</DayFont>
        </DDay>
        {/* 모임 날짜 */}
        <MainFont>
          <Text style={{color: theme.color.green}}>
            {month}월 {day}일
          </Text>
        </MainFont>
        <WithLocalSvg asset={Cash} />
      </Head>
      {/* <WithLocalSvg asset={Day} style={{left: -10, marginTop: 27}} /> */}
      <Bottom>
        <MidFont>{name}</MidFont>
        <Location>
          <WithLocalSvg asset={Mark} />
          {/* 모임 장소 */}
          <SubFont>서울특별시 용산구 청파동 스타벅스</SubFont>
        </Location>
        <View style={{justifyContent: 'space-evenly', paddingHorizontal: 30}}>
          <View style={{flexDirection: 'row'}}>
            <WithLocalSvg asset={Time} />
            {/* 모임 시간 */}
            <SubFont>{formattedTime}</SubFont>
          </View>
          <View style={{flexDirection: 'row'}}>
            <WithLocalSvg asset={People} />
            {/* 모임원 수 */}
            <SubFont>4명</SubFont>
          </View>
        </View>
      </Bottom>
    </Container>
  );
};

export default MoimCard;
