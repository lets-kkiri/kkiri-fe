import React, {useState, useEffect} from 'react';
import {Button} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {MoimType} from '../../slices/moim';
import {SetMoimType} from '../../pages/CreateMoim';

LocaleConfig.locales.kr = {
  monthNames: [
    'January',
    'Feburary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
};

interface CalenderProps {
  moim: MoimType;
  setMoim: SetMoimType;
}

LocaleConfig.defaultLocale = 'kr';

function MyCalender({moim, setMoim}: CalenderProps) {
  const [todayString, setTodayString] = useState('');
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (!moim) {
      return;
    }
    const todayObj = new Date();
    const year = todayObj.getFullYear();
    const month = ('0' + (todayObj.getMonth() + 1)).slice(-2);
    const day = ('0' + todayObj.getDate()).slice(-2);
    const today = `${year}-${month}-${day}`;
    if (moim && moim.date === today) {
      setTodayString('');
    } else {
      setTodayString(today);
    }
    setSelected(moim.date);
  }, [moim]);

  if (!moim) {
    return null; // moim이 존재하지 않을 때 렌더링하지 않음
  }

  return (
    <Calendar
      onDayPress={day => {
        const newMoim = {...moim};
        newMoim.date = day.dateString;
        setMoim({...newMoim});
        setSelected(day.dateString);
      }}
      monthFormat={'yy년 MM월'}
      markedDates={{
        [selected]: {
          selected: true,
          disableTouchEvent: true,
          selectedColor: '#FFD8CC',
          selectedTextColor: '#5968F2',
        },
        [todayString]: {
          selected: true,
          selectedColor: '#D0D0D0',
          selectedTextColor: '#868686',
        },
      }}
      theme={{
        backgroundColor: '#F8F9FF',
        calendarBackground: '#F8F9FF',
        dayTextColor: '#868686',
        todayTextColor: '#5968F2',
        arrowColor: '#B0BDFF',
      }}
    />
  );
}

export default MyCalender;
