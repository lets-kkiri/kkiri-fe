import React, {useEffect, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {CreateMoimProps} from '../../pages/CreateMoim';
import styled from 'styled-components/native';

const TimePickerContainer = styled.View`
  background-color: #f8f9ff;
  justify-content: center;
  align-items: center;
`;

function MyTimePicker({moim, setMoim}: CreateMoimProps) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (moim.time !== '') {
      const [hours, minutes] = moim.time.split(':').map(Number);
      const newDate = new Date();
      newDate.setHours(hours, minutes);
      setDate(newDate);
    }
  }, [moim.time]);

  if (!moim) {
    return null; // moim이 존재하지 않을 때 렌더링하지 않음
  }

  return (
    <TimePickerContainer>
      <DatePicker
        textColor="#5968F2"
        date={date}
        onDateChange={newDate => {
          setDate(newDate);
          const hours = newDate.getHours();
          const hourString =
            hours.toString().length === 2
              ? hours.toString()
              : '0' + hours.toString();
          const minutes = newDate.getMinutes();
          setMoim(prevMoim => ({
            ...prevMoim,
            time: `${hourString}:${minutes}`,
          }));
        }}
        locale="kr"
        mode="time"
        minuteInterval={5}
        fadeToColor="none"
      />
    </TimePickerContainer>
  );
}

export default MyTimePicker;
