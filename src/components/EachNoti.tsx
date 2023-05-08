import React from 'react';
import {Text, View} from 'react-native';
import {notiType} from '../slices/noti';

function EachNoti({noti}: {noti: notiType}) {
  // 여기에 알림 버튼 클릭 가능하게
  // 왼쪽으로 슬라이드시 삭제 버튼 보이기
  // 삭제 버튼 클릭 시 해당 값 삭제 처리 및 API? (백과 논의 필요)
  return (
    <View>
      <Text>{noti?.title}</Text>
      <Text>{noti?.message}</Text>
    </View>
  );
}

export default EachNoti;
