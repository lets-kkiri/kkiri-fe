import React from 'react';
import {View, Image, Text} from 'react-native';
import CustomButton from '../Common/Button';

interface BtnProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SendHelpNoti = ({setModalVisible}: BtnProps) => {
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
        <Text>도움을 요청했어요!</Text>
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
          <Text style={{fontSize: 12}}>친구가 길을 그리면</Text>
          <Text style={{fontSize: 12}}>알림을 통해 알려드려요!</Text>
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

export default SendHelpNoti;
