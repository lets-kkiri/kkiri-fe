import React from 'react';
import {Text, View} from 'react-native';
import {notiType} from '../slices/noti';

function EachNoti({noti}: {noti: notiType}) {
  // if (noti === undefined) {
  //   return null;
  // }
  return (
    <View>
      <Text>{noti?.title}</Text>
      <Text>{noti?.message}</Text>
    </View>
  );
}

export default EachNoti;
