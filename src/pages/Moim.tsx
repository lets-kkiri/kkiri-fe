import React, {useEffect, useState, useCallback} from 'react';
import {Text, ScrollView, FlatList, Button} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';

// API
import {authInstance} from '../api/axios';
import {requests} from '../api/requests';
import {getMoimInfo} from '../slices/moimInfo';
import {RootState, useAppDispatch} from '../store';
import {useSelector} from 'react-redux';

// Styled component
const MoimContainer = styled.View`
  flex-direction: column;
  flex: 1;
`;

const BannerContainer = styled.View`
  flex-direction: column;
  flex: 1;
  background-color: #f8f9ff;
  border-radius: 20px;
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
  margin: 12px 24px 12px 24px;
`;

const ViewBinder = styled.View`
  flex-direction: row;
  align-items: center;
  width: 80px;
  margin-right: 10;
`;

const MembersContainer = styled.View`
  flex-direction: column;
  flex: 0.4;
`;

const OptionText = styled.Text`
  color: #5968f2;
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

  const fetchData = async (id: number) => {
    try {
      const res = dispatch(getMoimInfo(id));
      console.log('moimDetailFetch:', res);
    } catch (err) {
      console.error('moim error :', err);
    }
  };

  // const [moimInfo, setMoimInfo] = useState<MoimInfo>({
  //   moimId: 0,
  //   name: '',
  //   placeName: '',
  //   latitude: '',
  //   longitude: '',
  //   date: '',
  //   time: '',
  //   lateFee: 0,
  //   members: [],
  // });

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

  return (
    <MoimContainer>
      <ScrollView>
        <BannerContainer>
          <HeaderContainer>
            <TitleContainer>
              <Title>{moimInfo.name}</Title>
            </TitleContainer>
            <Date>{dateSplit(moimInfo.date)}</Date>
          </HeaderContainer>
          <ListBinder>
            <ViewBinder>
              <IconConatiner>
                <WithLocalSvg asset={timeIcon} height={20} />
              </IconConatiner>
              <OptionText>시간</OptionText>
            </ViewBinder>
            <Text>{moimInfo.time}</Text>
          </ListBinder>
          <ListBinder>
            <ViewBinder>
              <IconConatiner>
                <WithLocalSvg asset={peopleIcon} height={20} />
              </IconConatiner>
              <OptionText>인원</OptionText>
            </ViewBinder>
            <Text>{moimInfo.members.length}명</Text>
          </ListBinder>
          <ListBinder>
            <ViewBinder>
              <IconConatiner>
                <WithLocalSvg asset={locationIcon} height={20} />
              </IconConatiner>
              <OptionText>장소</OptionText>
            </ViewBinder>
            <Text>{moimInfo.placeName}</Text>
          </ListBinder>
          <ListBinder>
            <ViewBinder>
              <IconConatiner>
                <WithLocalSvg asset={feeIcon} height={20} />
              </IconConatiner>
              <OptionText>지각비</OptionText>
            </ViewBinder>
            <Text>{moimInfo.lateFee}원</Text>
          </ListBinder>
        </BannerContainer>
        <MembersContainer>
          <ViewBinder>
            <Text>참여자</Text>
            <Text>{moimInfo.members.length}명</Text>
          </ViewBinder>
          <FlatList
            data={moimInfo.members}
            keyExtractor={member => member.kakaoId}
            renderItem={eachMember}
          />
        </MembersContainer>
        <Button
          title="채팅방 입장"
          onPress={() => navigation.navigate('Chatroom', {moimId: moimId})}
        />
      </ScrollView>
    </MoimContainer>
  );
}

export default Moim;
