import React from 'react';
import {View, Image, Text} from 'react-native';
import CustomButton from '../Common/Button';

interface BtnProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArriveNoti = ({setModalVisible}: BtnProps) => {
  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/icons/bear.png')}
          style={{width: 30, height: 33, marginRight: 10}}
        />
        <Text>목적지에 도착했습니다</Text>
      </View>
      <View 
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#B0BDFF",
          marginVertical: 10,
        }}
      />
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <View style={{marginRight: 20, marginVertical: 5}}>
          <Text style={{fontSize: 12}}>
            유저님은 5명 중 2등으로 도착했어요!
          </Text>
          <Text style={{fontSize: 12}}>약속 시간까지 아직 10분 남았어요!</Text>
        </View>
        <CustomButton
          text="확인"
          status="blur"
          // width="short"
          onPress={() => setModalVisible(false)}
        />
      </View>
    </View>
  );
};

export default ArriveNoti;
