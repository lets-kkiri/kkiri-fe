import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native';
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
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Image} from 'react-native';

// Styled components
const Container = styled.View<{
  width: number;
  theme: any;
  marginHorizontal: number;
}>`
  position: relative;
  width: ${({width}) => width}px;
  height: ${({width}) => width}px;
  background-color: ${({theme}) => theme.color.blue};
  border-radius: 15px;
  padding: 20px;
  font-family: 'Pretendard-Thin';
  margin-left: ${({marginHorizontal}) => marginHorizontal}px;
  margin-right: ${({marginHorizontal}) => marginHorizontal}px;
  display: flex;
  align-items: center;
`;

const Head = styled.View`
  width: 100%;
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
  margin-bottom: 16px;
  box-shadow: 0px 0px 5px #111111;
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
  margin-bottom: 16px;
`;

const Bottom = styled.View`
  position: absolute;
  left: 20px;
  bottom: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* background-color: red; */
`;

const TimeAndPeople = styled.View`
  display: flex;
  flex-direction: row;
`;

const ImageContainer = styled.View`
  width: 100%;
  height: 50%;
  /* position: absolute; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  /* background-color: red; */
`;

interface MoimCardProp {
  item: Moim;
  width: number;
  marginHorizontal: number;
}

const MoimCard = ({item, width, marginHorizontal}: MoimCardProp) => {
  const {moimId, name, placeName, date, time: meetingTime, members} = item;
  const [dday, setDday] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  const [formattedTime, setFormattedTime] = useState<string>('');

  const windowWidth = Dimensions.get('window').width;

  const theme = useSelector((state: RootState) => state.persisted.theme.theme);

  const cnt = useGetDday(date);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    setMonth(Number(date.slice(5, 7)));
    setDay(Number(date.slice(8, 10)));

    const zone = Number(meetingTime?.slice(0, 2)) >= 12 ? '오후' : '오전';
    const hour =
      Number(meetingTime?.slice(0, 2)) >= 12
        ? Number(meetingTime?.slice(0, 2)) - 12
        : Number(meetingTime?.slice(0, 2));
    const minute = Number(meetingTime?.slice(3, 5));
    setFormattedTime(`${zone} ${hour === 0 ? 12 : hour}시 ${minute}분`);
    setDday(cnt);
  }, []);

  const numbers = [
    require('../../assets/numbers/0.png'),
    require('../../assets/numbers/1.png'),
    require('../../assets/numbers/2.png'),
    require('../../assets/numbers/3.png'),
    require('../../assets/numbers/4.png'),
    require('../../assets/numbers/5.png'),
    require('../../assets/numbers/6.png'),
    require('../../assets/numbers/7.png'),
    require('../../assets/numbers/8.png'),
    require('../../assets/numbers/9.png'),
  ];

  return (
    <TouchableHighlight
      activeOpacity={0.9}
      underlayColor={theme.color.white}
      onPress={() => {
        navigation.navigate('Moim', {moimId: moimId});
      }}>
      <Container
        width={width}
        theme={theme}
        marginHorizontal={marginHorizontal}>
        <Head>
          <DDay>
            <DayFont>
              {dday > 0 ? `D-${dday}` : dday === 0 ? 'D-day' : '지남'}
            </DayFont>
          </DDay>
          <MainFont>
            <Text style={{color: theme.color.green}}>
              {month}월 {day}일
            </Text>
          </MainFont>
          <WithLocalSvg asset={Cash} />
        </Head>
        {/* <ImageContainer>
          {day
            .toString()
            .split('')
            .map(number => {
              return (
                <Image
                  source={numbers[Number(number)]}
                  style={{
                    resizeMode: 'contain',
                    height: 100,
                    position: 'absolute',
                  }}
                />
              );
            })}
        </ImageContainer> */}
        <Bottom>
          <MidFont>{name}</MidFont>
          <Location>
            <WithLocalSvg asset={Mark} />
            {/* 모임 장소 */}
            <SubFont>{placeName}</SubFont>
          </Location>
          <TimeAndPeople
            style={{justifyContent: 'space-evenly', paddingHorizontal: 30}}>
            <View
              style={{
                flexDirection: 'row',
                marginRight: 24,
                alignItems: 'center',
              }}>
              <WithLocalSvg asset={Time} />
              <SubFont>{formattedTime}</SubFont>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <WithLocalSvg asset={People} />
              {/* 모임원 수 */}
              <SubFont>{members.length}명</SubFont>
            </View>
          </TimeAndPeople>
        </Bottom>
      </Container>
    </TouchableHighlight>
  );
};

export default MoimCard;
