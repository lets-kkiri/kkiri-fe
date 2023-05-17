import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import arrow from '../../assets/icons/arrow.svg';
import {WithLocalSvg} from 'react-native-svg';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {Moim} from '../../types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Styled components
const ModalContainer = styled.View<{windowWidth: number}>`
  display: flex;
  flex-direction: row;
  position: absolute;
  width: ${({windowWidth}) => windowWidth - 32}px;
  max-width: ${({windowWidth}) => windowWidth - 32}px;
  margin-left: 16px;
  border-radius: 15px;
  z-index: 10;
  height: 100px;
`;

const FlexContainer = styled.View<{theme: any}>`
  padding: 24px;
  border-radius: 15px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 20%;
`;

const PurpleContainer = styled(FlexContainer)<{theme: any}>`
  border-radius: 15px;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  background-color: ${({theme}) => theme.color.blue3};
  align-items: flex-start;
  width: 80%;
`;

const TitleText = styled.Text<{theme: any}>`
  color: ${({theme}) => theme.color.blue};
`;

const BoldText = styled.Text`
  font-weight: 800;
`;

interface ModalToRealTimeProp {
  moimInfo: Moim;
}

const ModalToRealtime = ({moimInfo}: ModalToRealTimeProp) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useSelector((state: RootState) => state.persisted.theme.theme);

  const windowWidth = Dimensions.get('window').width;
  console.log('windowWidth :', windowWidth);
  console.log('moimInfo :', moimInfo);
  return (
    <ModalContainer windowWidth={windowWidth} style={style.shadow}>
      <PurpleContainer theme={theme}>
        {moimInfo && (
          <TitleText theme={theme}>
            <BoldText>{moimInfo.name}</BoldText>
            {` `}모임이 1시간 남았어요.
          </TitleText>
        )}
        <Text>실시간으로 친구들의 위치를 확인해보세요!</Text>
      </PurpleContainer>
      <FlexContainer theme={theme}>
        <TouchableHighlight
          onPress={() =>
            navigation.navigate('Chatroom', {moimId: moimInfo.moimId})
          }
          activeOpacity={0.9}
          underlayColor="#FFFFFF"
          style={{borderRadius: 99}}>
          <WithLocalSvg asset={arrow} />
        </TouchableHighlight>
        <TitleText style={{fontSize: 10}}>START</TitleText>
      </FlexContainer>
    </ModalContainer>
  );
};

export default ModalToRealtime;

const style = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#ffffff',
        shadowOffset: {width: 10, height: 10},
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 20,
      },
    }),
  },
});
