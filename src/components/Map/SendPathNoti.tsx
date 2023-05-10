import React from 'react';
import {View, Image, Text} from 'react-native';
import CustomButton from '../Common/Button';

interface BtnProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SendPathNoti = ({setModalVisible}: BtnProps) => {
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
        <Text>길안내 알림을 전송했어요!</Text>
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
            실시간 끼리 맵을 통해 친구가 무사히
          </Text>
          <Text style={{fontSize: 12}}>오고 있는지 확인해주세요!</Text>
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

export default SendPathNoti;
