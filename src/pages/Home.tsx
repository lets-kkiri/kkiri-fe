import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import {WeekCalendar, CalendarProvider} from 'react-native-calendars';
import {Dimensions, ScrollView, Text, useColorScheme} from 'react-native';
import styled from 'styled-components/native';
import MoimCard from '../components/Common/MoimCard';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../store';
import CustomTheme from 'styled-components/native';

// Redux
// import {getMoimList} from '../slices/moimlistSlice';
import {authInstance} from '../api/axios';
import {requests} from '../api/requests';
import {FlatList} from 'react-native-gesture-handler';
import {Moim} from '../types';
import Carousel from '../components/Carousel';
import notiSlice from '../slices/noti';
import NotiBox from '../components/Common/NotiBox';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Styled component
const HomeContainer = styled.View<{theme: any}>`
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
  /* background-color: ${({theme}) => theme.color.background}; */
`;
const HeaderContainer = styled.View`
  background-color: ${({theme}) => theme.color.background};
  flex-direction: column;
  padding: 24px;
`;
const CalendarContainer = styled.View`
  /* flex-direction: column; */
  height: 40px;
`;
const CardsContainer = styled.View<{theme: any}>`
  background-color: ${({theme}) => theme.color.background};
  /* flex-direction: row; */
  position: absolute;
  bottom: 0px;
  justify-content: center;
  padding-bottom: 8px;
  padding-top: 8px;
`;

export default function Home() {
  const today = moment().tz('Asia/Seoul').format('YYYY-MM-DD');
  const [selectedDay, setSelectedDay] = useState('');
  const [moimList, setMoimList] = useState<Moim[]>([]);

  const colorScheme = useColorScheme();
  const theme = useSelector((state: RootState) => state.persisted.theme.theme);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // 유저정보
  const userInfo = useSelector((state: RootState) => state.persisted.user);
  const notices = useSelector((state: RootState) => state.persisted.noti);

  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (!userInfo.accessToken) {
      return;
    }
    setSelectedDay(today);

    const get_moim_list = async () => {
      authInstance.defaults.headers.common.Authorization = `Bearer ${userInfo.accessToken}`;
      const {data} = await authInstance.get(requests.GET_MOIM_LIST());
      setMoimList(data.moimCardList);
    };

    get_moim_list();
  }, [today, userInfo.accessToken]);

  if (!selectedDay) {
    return null;
  }

  return (
    <HomeContainer theme={theme}>
      {notices.length > 0 ? (
        notices[0].channelId === 'comming' && !notices[0].checked ? (
          <HeaderContainer>
            <NotiBox
              nickname=""
              mainTitle={notices[0].message}
              subTitle="실시간으로 친구들의 위치를 확인해 보세요!"
              onPress={() => {
                dispatch(notiSlice.actions.clickNoti(notices[0]));
                const socket = new WebSocket(
                  `wss://k8a606.p.ssafy.io/ws/api/${notices[0].data.moimId}`,
                );
                console.log('socket');
                console.log('socket open');
                socket.onopen = () => {
                  console.log('연결!');
                  // 소켓 열고 유저 정보 보내기
                  socket?.send(
                    JSON.stringify({
                      type: 'JOIN',
                      content: {
                        kakaoId: userInfo.id,
                      },
                    }),
                  );
                };
                if (socket) {
                  navigation.navigate('Chatroom', {
                    moimId: notices[0].data.moimId,
                    socket: socket,
                  });
                }
              }}
              type="commming"
            />
          </HeaderContainer>
        ) : (
          <HeaderContainer>
            <Text>{userInfo.nickname} 님</Text>
            <Text>
              이번 주 약속이 <Text style={{color: theme.color.blue}}>9개</Text>
              있어요!
            </Text>
          </HeaderContainer>
        )
      ) : (
        <HeaderContainer>
          <Text>{userInfo.nickname} 님</Text>
          <Text>
            이번 주 약속이 <Text style={{color: theme.color.blue}}>9개</Text>
            있어요!
          </Text>
        </HeaderContainer>
      )}
      <CalendarContainer>
        <CalendarProvider
          date={today}
          onDateChanged={date => {
            console.log(date);
            setSelectedDay(date);
          }}
          onMonthChange={month => console.log(month)}
          disabledOpacity={0.6}
          style={{backgroundColor: theme.color.background}}
          theme={{
            todayButtonTextColor: theme.color.blue,
          }}
          todayBottomMargin={16}>
          <WeekCalendar
            allowShadow={false}
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
        <Carousel
          gap={windowWidth * 0.04}
          offset={windowWidth * 0.08}
          pages={moimList}
          pageWidth={windowWidth * 0.78}
        />
      </CardsContainer>
    </HomeContainer>
  );
}
