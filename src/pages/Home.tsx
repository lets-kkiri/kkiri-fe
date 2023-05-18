import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import {WeekCalendar, CalendarProvider} from 'react-native-calendars';
import {Dimensions, ScrollView, Text, View, useColorScheme} from 'react-native';
import styled from 'styled-components/native';
import MoimCard from '../components/Common/MoimCard';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../store';
import CustomTheme from 'styled-components/native';

// Icons
import arrow from '../assets/icons/arrow_down.svg';

// Redux
import {authInstance} from '../api/axios';
import {requests} from '../api/requests';
import {Moim} from '../types';
import Carousel from '../components/Carousel';
import notiSlice from '../slices/noti';
import NotiBox from '../components/Common/NotiBox';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {WithLocalSvg} from 'react-native-svg';

// Styled component
const HomeContainer = styled.View<{theme: any}>`
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${({theme}) => theme.color.background};
`;
const HeaderContainer = styled.View<{theme: any}>`
  background-color: ${({theme}) => theme.color.background};
  flex-direction: column;
  padding: 24px;
`;
const CalendarContainer = styled.View<{theme: any}>`
  /* flex-direction: column; */
  height: 120px;
  background-color: ${({theme}) => theme.color.backBlue};
`;
const CardsContainer = styled.View<{theme: any}>`
  background-color: ${({theme}) => theme.color.backBlue};
  /* flex-direction: row; */
  position: relative;
  bottom: 0px;
  justify-content: center;
  padding-bottom: 8px;
  padding-top: 8px;
`;

const MonthSelectBtn = styled.TouchableHighlight`
  width: 130px;
  padding: 8px;
`;

const MonthSelectContainer = styled.View`
  padding-left: 16px;
`;

export default function Home() {
  const today = moment().tz('Asia/Seoul').format('YYYY-MM-DD');
  const [selectedDay, setSelectedDay] = useState('');
  const [moimList, setMoimList] = useState<Moim[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState(today.slice(0, 4));
  const [selectedMonth, setSelectedMonth] = useState(today.slice(5, 7));
  const [showDropDown, setShowDropDown] = useState(false);

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
  }, []);

  if (!selectedDay) {
    return null;
  }

  return (
    <HomeContainer theme={theme}>
      {notices.length > 0 ? (
        notices[0].channelId === 'comming' && !notices[0].checked ? (
          <HeaderContainer theme={theme}>
            <NotiBox
              nickname={notices[0].data.moimName}
              mainTitle=" 모임이 1시간 남았어요!"
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
          <HeaderContainer theme={theme}>
            <Text style={{fontSize: 16, color: theme.color.text}}>
              {userInfo.nickname} 님
            </Text>
            <Text style={{fontSize: 16, color: theme.color.text}}>
              이번 주 약속이{' '}
              <Text style={{color: theme.color.blue}}>{moimList.length}개</Text>
              있어요!
            </Text>
          </HeaderContainer>
        )
      ) : (
        <HeaderContainer theme={theme}>
          <Text style={{fontSize: 16, color: theme.color.text}}>
            {userInfo.nickname} 님
          </Text>
          <Text style={{fontSize: 16, color: theme.color.text}}>
            약속이{' '}
            <Text style={{color: theme.color.blue, fontWeight: '800'}}>
              {moimList.length}개
            </Text>
            있어요!
          </Text>
        </HeaderContainer>
      )}
      <CalendarContainer theme={theme}>
        <MonthSelectContainer>
          <MonthSelectBtn
            activeOpacity={0.6}
            underlayColor={theme.color.orange3}
            onPress={() => setShowDropDown(prev => !prev)}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{color: theme.color.text, fontSize: 12}}>
                {selectedYear}년 {selectedMonth}월
              </Text>
              <WithLocalSvg asset={arrow} />
            </View>
          </MonthSelectBtn>
        </MonthSelectContainer>
        <CalendarProvider
          date={today}
          onDateChanged={date => {
            console.log('date :', date);
            setSelectedDay(date);
          }}
          onMonthChange={month => console.log('month :', month)}
          disabledOpacity={0.6}
          style={{backgroundColor: theme.color.backBlue}}
          theme={{
            todayButtonTextColor: theme.color.blue,
          }}
          todayBottomMargin={16}>
          <WeekCalendar
            style={{backgroundColor: theme.color.backBlue}}
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
