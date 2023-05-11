import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {CreateMoimProps} from '../../pages/CreateMoim';

function MyTimePicker({moim, setMoim}: CreateMoimProps) {
  const [date, setDate] = useState(new Date());

  // useEffect(() => {
  //   if (!moim || moim.time === '') {
  //     return;
  //   }
  //   setDate(moim.time);
  // }, [moim]);

  if (!moim) {
    return null; // moim이 존재하지 않을 때 렌더링하지 않음
  }

  return (
    <View style={{backgroundColor: '#F8F9FF'}}>
      <DatePicker
        textColor="#5968F2"
        androidVariant="nativeAndroid"
        date={date}
        onDateChange={date => {
          setDate(date);
          console.log(date);
        }}
        mode="time"
        minuteInterval={5}
        fadeToColor="none"
      />
    </View>
  );
}

export default MyTimePicker;
