import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {notiType} from '../slices/noti';

import notiSlice from '../slices/noti';
import {useAppDispatch} from '../store';
import PushNotification from 'react-native-push-notification';

function EachNoti({noti}: {noti: notiType}) {
  const dispatch = useAppDispatch();

  return (
    <View style={styles.swipeListItem}>
      <TouchableOpacity
        onPress={() => {
          PushNotification.cancelLocalNotification(noti);
          dispatch(notiSlice.actions.clickNoti(noti));
        }}>
        <Text
          style={
            noti.checked ? styles.clickedSwipeListText : styles.swipeListText
          }>
          {noti?.channelId}
        </Text>
        <Text
          style={
            noti.checked ? styles.clickedSwipeListText : styles.swipeListText
          }>
          {noti?.message}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  swipeListItem: {
    alignItems: 'center',
    backgroundColor: '#eee',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 10,
  },
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
