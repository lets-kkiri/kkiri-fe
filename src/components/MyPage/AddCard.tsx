import React, {useState} from 'react';
import {Text, TextInput, View} from 'react-native';
import CustomButton from '../Common/Button';
import {authInstance} from '../../api/axios';
import {requests} from '../../api/requests';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

function AddCard() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [moimId, setMoimId] = useState(0);
  const addCard = async () => {
    if (!moimId || moimId === 0) {
      return;
    }
    try {
      const response = await authInstance.post(requests.POST_JOIN_MOIM(), {
        moimId: moimId,
      });
      navigation.navigate('Moim', {moimId: response.data.moimId});
    } catch (err) {
      console.error('add card 에러:', err);
    }
  };

  return (
    <View>
      <Text>모임 참여를 위한 임시 컴포넌트입니다.</Text>
      <TextInput
        placeholder="참여할 모임의 모임 번호를 입력해주세요"
        keyboardType="numeric"
        value={moimId !== 0 ? moimId.toString() : null}
        onChangeText={text => {
          setMoimId(parseInt(text));
        }}
      />
      <CustomButton
        text="모임 참여하기"
        status={moimId > 0 ? 'active' : 'disabled'}
        width="long"
        onPress={addCard}
      />
    </View>
  );
}

export default AddCard;
