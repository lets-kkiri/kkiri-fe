import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import {WeekCalendar, CalendarProvider} from 'react-native-calendars';
import {Dimensions, ScrollView, Text, useColorScheme} from 'react-native';
import styled from 'styled-components/native';
import MoimCard from '../components/Common/MoimCard';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import CustomTheme from 'styled-components/native';

// Redux
// import {getMoimList} from '../slices/moimlistSlice';
import {authInstance} from '../api/axios';
import {requests} from '../api/requests';
import {FlatList} from 'react-native-gesture-handler';
import {Moim} from '../types';
import Carousel from '../components/Carousel';

// Styled component
const HomeContainer = styled.View<{theme}>`
  flex-direction: column;
  flex: 1;
  background-color: ${({theme}) => theme.color.background};
`;
const HeaderContainer = styled.View`
  flex-direction: column;
  flex: 0.3;
`;
const CalendarContainer = styled.View`
  flex-direction: column;
  flex: 0.2;
`;
const CardsContainer = styled.View`
  flex-direction: row;
  flex: 0.5;
  justify-content: center;
`;

export default function Home() {
  const today = moment().tz('Asia/Seoul').format('YYYY-MM-DD');
  const [selectedDay, setSelectedDay] = useState('');
  const [moimList, setMoimList] = useState<Moim[]>([]);

  const colorScheme = useColorScheme();
  const theme = useSelector((state: RootState) => state.persisted.theme.theme);
  const dispatch = useDispatch();

  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    setSelectedDay(today);

    const get_moim_list = async () => {
      const {data} = await authInstance.get(requests.GET_MOIM_LIST());
      setMoimList(data.moimCardList);
      console.log('모임 리스트 get :', data);
    };

    get_moim_list();
  }, [today]);

  if (!selectedDay) {
    return null;
  }

  return (
    <HomeContainer theme={theme}>
      <HeaderContainer>
        <Text>내용</Text>
      </HeaderContainer>
      <CalendarContainer>
        <CalendarProvider
          date={today}
          onDateChanged={date => {
            console.log(date);
            setSelectedDay(date);
          }}
          onMonthChange={month => console.log(month)}
          disabledOpacity={0.6}
          theme={{
            todayButtonTextColor: '#0059b3',
          }}
          todayBottomMargin={16}>
          <WeekCalendar
            allowShadow={true}
            // allowShadow={false}
            current={selectedDay}
            markedDates={{
              // 오늘 날짜를 표시하기 위한 설정
              [today]: {
                marked: true,
              },
            }}
          />
        </CalendarProvider>
      </CalendarContainer>
      <CardsContainer>
        {/* {moimList} */}
        <Carousel
          gap={windowWidth * 0.02}
          offset={windowWidth * 0.1}
          pages={moimList}
          pageWidth={windowWidth * 0.78}
        />
      </CardsContainer>
    </HomeContainer>
  );
}
