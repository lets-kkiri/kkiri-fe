import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {notiType} from '../slices/noti';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';

import notiSlice from '../slices/noti';
import {useAppDispatch} from '../store';
import PushNotification from 'react-native-push-notification';

// Icons
const ChatOff = require('../assets/noti_icons/noti_chat_off.svg');
const ChatOn = require('../assets/noti_icons/noti_chat_on.svg');
const PathOn = require('../assets/noti_icons/noti_draw_on.svg');
const PathOff = require('../assets/noti_icons/noti_draw_off.svg');
const HelpOn = require('../assets/noti_icons/noti_help_on.svg');
const HelpOff = require('../assets/noti_icons/noti_help_off.svg');
const CommingOn = require('../assets/noti_icons/noti_moim_on.svg');
const CommingOff = require('../assets/noti_icons/noti_moim_off.svg');
const HurryOn = require('../assets/noti_icons/noti_loc_on.svg');
const HurryOff = require('../assets/noti_icons/noti_loc_off.svg');

// 정산 알림
const FeeOn = require('../assets/noti_icons/noti_fee_on.svg');
const FeeOff = require('../assets/noti_icons/noti_fee_off.svg');

const ItemContainer = styled.View`
  width: 100%;
  height: 75px;
  background-color: #ffffff;
  margin-bottom: 15px;
  justify-content: center;
  align-items: center;
`;

const NotiContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 343px;
  height: 75px;
  border: 1px;
  border-radius: 15px;
  border-color: ${props => (props.checked ? '#D0D0D0' : '#5968f2')};
`;

const IconContainer = styled.View`
  display: flex;
  width: 35px;
  height: 35px;
  margin: 20px;
`;

const TextContainer = styled.View`
  display: flex;
  flex-direction: column;
`;

const Message = {
  hurry: '약속 시간이 임박했어요! 조금만 더 서두를까요?',
  comming: '실시간으로 친구들의 위치를 확인해보세요!',
  chat: '친구들에게 대화가 왔어요!',
  sos: '손가락으로 길을 그려 친구에게 보내주세요!',
  path: 'AR 길 안내를 확인하고 목적지로 이동해보세요!',
};

function EachNoti({noti}: {noti: notiType}) {
  const dispatch = useAppDispatch();

  let asset;
  switch (noti.channelId) {
    case 'hurry':
      asset = noti.checked === false ? HurryOn : HurryOff;
      break;
    case 'comming':
      asset = noti.checked === false ? CommingOn : CommingOff;
      break;
    case 'chat':
      asset = noti.checked === false ? ChatOn : ChatOff;
      break;
    case 'sos':
      asset = noti.checked === false ? HelpOn : HelpOff;
      break;
    case 'path':
      asset = noti.checked === false ? PathOn : PathOff;
      break;
    default:
      asset = noti.checked === false ? ChatOn : ChatOff;
      break;
  }

  return (
    <ItemContainer>
      <NotiContainer
        checked={noti.checked}
        onPress={() => {
          PushNotification.cancelLocalNotification(noti);
          dispatch(notiSlice.actions.clickNoti(noti));
        }}>
        <IconContainer>
          <WithLocalSvg asset={asset} width={35} height={35} />
        </IconContainer>
        <Text
          style={
            noti.checked ? styles.clickedSwipeListText : styles.swipeListText
          }>
          {noti?.message}
        </Text>
        {/* <Text>{Message[noti.channelId]}</Text> */}
      </NotiContainer>
    </ItemContainer>
  );
}

const styles = StyleSheet.create({
  swipeListText: {
    flex: 1,
    color: 'black',
    fontSize: 14,
  },
  clickedSwipeListText: {
    flex: 1,
    color: 'grey',
    fontSize: 14,
  },
});

export default EachNoti;
