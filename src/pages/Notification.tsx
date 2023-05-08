import React, {useCallback, useEffect} from 'react';
import {FlatList, View} from 'react-native';

import {notiType} from '../slices/noti';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import EachNoti from '../components/EachNoti';

function Notification() {
  const notices = useSelector((state: RootState) => state.noti);
  const renderNoti = useCallback(({item}: {item: notiType}) => {
    console.log('noti', item);
    return <EachNoti noti={item} />;
  }, []);

  useEffect(() => {
    console.log('notis', notices);
  }, [notices]);

  return (
    <View>
      {notices && (
        <FlatList
          data={notices}
          keyExtractor={noti => noti.id}
          renderItem={renderNoti}
        />
      )}
    </View>
  );
}

export default Notification;
