import React, {useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';

import {notiType} from '../slices/noti';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import EachNoti from '../components/EachNoti';
import {SafeAreaView} from 'react-native-safe-area-context';

import notiSlice from '../slices/noti';
import {useAppDispatch} from '../store';

function Notification() {
  const dispatch = useAppDispatch();
  const notices = useSelector((state: RootState) => state.noti);

  const renderNoti = useCallback(({item}: {item: notiType}) => {
    console.log('noti', item);
    return <EachNoti noti={item} />;
  }, []);

  const renderSwipeBtn = useCallback(({item}: {item: notiType}) => {
    return (
      <View style={styles.swipeHiddenItemContainer}>
        <TouchableOpacity
          onPress={() => {
            // 삭제 버튼 클릭 시 해당 값 삭제 처리 및 API? (백과 논의 필요)
            console.log('아이템 삭제:', item.id);
            dispatch(notiSlice.actions.delNoti(item.id));
          }}>
          <View style={styles.swipeHiddenItem}>
            <Text style={styles.swipeHiddenItemText}>삭제</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }, []);

  useEffect(() => {
    console.log('notis', notices);
  }, [notices]);

  return (
    <SafeAreaView style={styles.container}>
      {notices && (
        <SwipeListView
          data={notices}
          keyExtractor={noti => noti.id}
          renderItem={renderNoti}
          renderHiddenItem={renderSwipeBtn}
          rightOpenValue={-75} // 왼쪽으로 스와이프 했을 때, 열리는 너비
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styledText: {
    color: '#111',
    fontWeight: 'bold',
  },
  swipeHiddenItemContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#eee',
    flexDirection: 'row-reverse',

    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  swipeHiddenItem: {
    width: 70,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  swipeHiddenItemText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Notification;
