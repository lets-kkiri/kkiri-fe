import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import {WeekCalendar, CalendarProvider} from 'react-native-calendars';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import MoimCard from '../components/Common/MoimCard';

// Styled component
const HomeContainer = styled.View`
  flex-direction: column;
  flex: 1;
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

  useEffect(() => {
    setSelectedDay(today);
  }, [today]);
  // console.log(new Date());
  if (!selectedDay) {
    return null;
  }

  return (
    <HomeContainer>
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
        <MoimCard />
        {/* <Text>카드 들어갈 곳</Text> */}
      </CardsContainer>
    </HomeContainer>
  );
}
