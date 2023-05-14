import React, {useEffect, useState, useCallback} from 'react';
import {Text, View, FlatList} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
// API
import {authInstance} from '../api/axios';
import {requests} from '../api/requests';

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
  const [moimInfo, setMoimInfo] = useState<MoimInfo>({
    moimId: 0,
    name: '',
    placeName: '',
    latitude: '',
    longitude: '',
    date: '',
    time: '',
    lateFee: 0,
    members: [],
  });

  const eachMember = useCallback(({item}: {item: MemberInfo}) => {
    return <Text>{item.nickname}</Text>;
  }, []);

  useEffect(() => {
    if (moimId === undefined) {
      return;
    }
    const getData = async () => {
      try {
        const response = await authInstance.get(requests.GET_MOIM_INFO(moimId));
        setMoimInfo({...response.data});
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, [moimId]);

  // useEffect(() => {
  //   console.log(moimInfo);
  //   console.log('members:', moimInfo.members);
  // }, [moimInfo]);

  if (moimInfo === undefined || moimInfo.moimId === 0) {
    return null;
  }

  return (
    <View>
      <Text>{moimInfo.moimId}번 모임입니다.</Text>
      <Text>"{moimInfo.name}"</Text>
      <Text>{moimInfo.placeName}로</Text>
      <Text>
        {moimInfo.date} {moimInfo.time}까지 오세요
      </Text>
      <Text>지각비 : {moimInfo.lateFee}원</Text>
      <FlatList
        data={moimInfo.members}
        keyExtractor={member => member.kakaoId}
        renderItem={eachMember}
      />
    </View>
  );
}

export default Moim;
