import React, {useEffect, useState, useCallback} from 'react';
import {Text, ScrollView, Button, Dimensions, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';
import {useSelector} from 'react-redux';

// Components
import MemberItem from '../components/Moim/MemberItem';
import InviteMemberItem from '../components/Moim/InviteMemberItem';

// API
import {authInstance} from '../api/axios';
import {requests} from '../api/requests';
import {getMoimInfo} from '../slices/moimInfo';
import {RootState, useAppDispatch} from '../store';

// Styled component
const MoimContainer = styled.View<{theme: any}>`
  position: relative;
  height: ${() => Dimensions.get('window').height};
  flex-direction: column;
  flex: 1;
  background-color: ${({theme}) => theme.color.background};
`;

const BannerContainer = styled.View<{theme: any}>`
  flex-direction: column;
  flex: 1;
  background-color: ${({theme}) => theme.color.backBlue};
  border-radius: 20px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  padding-bottom: 16px;
`;

const HeaderContainer = styled.View`
  flex-direction: column;
  padding: 12px 16px 12px 16px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const Title = styled.Text`
  font-size: 24px;
  color: #5968f2;
`;

const Date = styled.Text`
  font-size: 16px;
`;

const IconConatiner = styled.View`
  height: 24px;
  width: 24px;
  margin-right: 12px;
  align-items: center;
  justify-content: center;
`;

const ListBinder = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 8px 0px 8px 24px;
`;

const ViewBinder = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100px;
  margin-right: 16px;
`;

const MembersContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const OptionText = styled.Text<{theme: any}>`
  color: ${({theme}) => theme.color.blue};
`;

const MemberContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 110px;
  height: 50px;
  border-radius: 15px;
  background-color: #f8f9ff;
  padding: 12px;
`;

const MemberThumbnail = styled.Image`
  width: 26px;
  height: 26px;
  border-radius: 25px;
  margin-right: 12px;
`;

const InfoText = styled.Text<{theme: any}>`
  color: ${({theme}) => theme.color.text};
  font-size: 13px;
`;

const BottomContainer = styled.View`
  padding: 16px;
  padding-top: 24px;
`;

const ChatBtn = styled.TouchableHighlight<{theme: any}>`
  border-radius: 15px;
  background-color: ${({theme}) => theme.color.blue};
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Icons
const peopleIcon = require('../assets/icons/people.svg');
const timeIcon = require('../assets/icons/moim_time.svg');
const locationIcon = require('../assets/icons/moim_location.svg');
const feeIcon = require('../assets/icons/moim_fee.svg');

// types
interface MoimProps {
  navigation: StackNavigationProp<RootStackParamList, 'Moim'>;
  route: RouteProp<RootStackParamList, 'Moim'>;
}

type MemberInfo = {
  kakaoId: string;
  profileImage: string;
  nickname: string;
};

interface MoimInfo {
  moimId: 0;
  name: '';
  placeName: '';
  latitude: '';
  longitude: '';
  date: '';
  time: '';
  lateFee: 0;
  members: MemberInfo[];
}

function Moim({navigation, route}: MoimProps) {
  const moimId = route.params.moimId;
  const dispatch = useAppDispatch();
  const moimInfo = useSelector((state: RootState) => state.volatile.moimInfo);
  const notices = useSelector((state: RootState) => state.persisted.noti);
  const userInfo = useSelector((state: RootState) => state.persisted.user);

  const fetchData = async (id: number) => {
    try {
      const res = dispatch(getMoimInfo(id));
      console.log('moimDetailFetch:', res);
    } catch (err) {
      console.error(err);
    }
  };

  const theme = useSelector((state: RootState) => state.persisted.theme.theme);

  const eachMember = useCallback(({item}: {item: MemberInfo}) => {
    return (
      <MemberContainer>
        <MemberThumbnail source={{uri: item.profileImage}} />
        <Text>{item.nickname}</Text>
      </MemberContainer>
    );
  }, []);

  const dateSplit = (dateStr: string) => {
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(5, 7);
    const day = dateStr.slice(8, 10);
    return `${year}년 ${month}월 ${day}일`;
  };

  // useEffect(() => {
  //   if (moimId === undefined) {
  //     return;
  //   }
  //   const getData = async () => {
  //     try {
  //       const response = await authInstance.get(requests.GET_MOIM_INFO(moimId));
  //       setMoimInfo({...response.data});
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   getData();
  // }, [moimId]);

  useEffect(() => {
    if (!moimId) {
      return;
    }
    fetchData(moimId);
  }, [moimId]);

  if (moimInfo === undefined || moimInfo.moimId === 0) {
    return null;
  }

  const windowWidth = Dimensions.get('window').width;

  return (
    <MoimContainer theme={theme}>
      <ScrollView>
        <BannerContainer theme={theme}>
          <HeaderContainer>
            <TitleContainer>
              <Title>{moimInfo.name}</Title>
            </TitleContainer>
            <Date style={{color: theme.color.grey90, fontSize: 16}}>
              {dateSplit(moimInfo.date)}
            </Date>
          </HeaderContainer>
          <ListBinder>
            <ViewBinder>
              <IconConatiner>
                <WithLocalSvg asset={timeIcon} height={20} />
              </IconConatiner>
              <OptionText theme={theme} style={{color: theme.color.blue}}>
                시간
              </OptionText>
            </ViewBinder>
            <InfoText theme={theme}>{moimInfo.time}</InfoText>
          </ListBinder>
          <ListBinder>
            <ViewBinder>
              <IconConatiner>
                <WithLocalSvg asset={peopleIcon} height={20} />
              </IconConatiner>
              <OptionText>인원</OptionText>
            </ViewBinder>
            <InfoText theme={theme}>{moimInfo.members.length}명</InfoText>
          </ListBinder>
          <ListBinder>
            <ViewBinder>
              <IconConatiner>
                <WithLocalSvg asset={locationIcon} height={20} />
              </IconConatiner>
              <OptionText>장소</OptionText>
            </ViewBinder>
            <InfoText theme={theme}>{moimInfo.placeName}</InfoText>
          </ListBinder>
          <ListBinder>
            <ViewBinder>
              <IconConatiner>
                <WithLocalSvg asset={feeIcon} height={20} />
              </IconConatiner>
              <OptionText>지각비</OptionText>
            </ViewBinder>
            <InfoText theme={theme}>{moimInfo.lateFee}원</InfoText>
          </ListBinder>
        </BannerContainer>
        <BottomContainer>
          <ViewBinder style={{marginBottom: 16}}>
            <Text style={{color: theme.color.text, paddingRight: 12}}>
              참여자
            </Text>
            <InfoText theme={theme} style={{color: theme.color.blue}}>
              {moimInfo.members.length}명
            </InfoText>
          </ViewBinder>
          <MembersContainer>
            {moimInfo.members.map(member => (
              <MemberItem
                key={member.kakaoId}
                member={member}
                width={windowWidth - 32}
              />
            ))}
            <InviteMemberItem
              width={windowWidth - 32}
              onPress={() => console.log('pressed')}
            />
          </MembersContainer>
        </BottomContainer>
      </ScrollView>
      <View
        style={{position: 'absolute', width: '100%', padding: 16, bottom: 0}}>
        <ChatBtn
          activeOpacity={0.7}
          underlayColor={theme.color.blue2}
          theme={theme}
          onPress={() => {
            const socket = new WebSocket(
              `wss://k8a606.p.ssafy.io/ws/api/${moimId}`,
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
                moimId: moimId,
                socket: socket,
              });
            }
          }}>
          <Text style={{color: theme.color.white}}>친구들과 소통하기</Text>
        </ChatBtn>
      </View>
    </MoimContainer>
  );
}

export default Moim;
