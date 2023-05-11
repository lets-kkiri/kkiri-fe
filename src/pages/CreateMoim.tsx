import React, {useCallback, useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import MyCalender from '../components/CreateMoim/MyCalender';
import {MoimType} from '../slices/moim';
import MyTimePicker from '../components/CreateMoim/MyTimePicker';

export type SetMoimType = React.Dispatch<React.SetStateAction<MoimType>>;
export interface CreateMoimProps {
  moim: MoimType;
  setMoim: SetMoimType;
}

function CreateMoim() {
  const [moim, setMoim] = useState<MoimType>({
    name: '',
    link: '',
    date: '',
    time: '',
    placeName: '',
    latitude: 0,
    longitude: 0,
    lateFee: 0,
  });

  const [formOpen, setFormOpen] = useState([false, false, false, false]);
  const [formDone, setFormDone] = useState([false, false, false, false]);

  const formOpenHandler = useCallback(
    idx => {
      const newFormOpen = [false, false, false, false];
      if (formOpen[idx] === false) {
        newFormOpen[idx] = true;
      }
      setFormOpen([...newFormOpen]);
    },
    [formOpen],
  );

  useEffect(() => {
    console.log(moim);
  });

  return (
    <View>
      <Text>모임 생성 중</Text>
      <TextInput placeholder="모임 이름을 입력해주세요." />

      <TouchableOpacity onPress={() => formOpenHandler(0)}>
        <Text>날짜</Text>
        {moim?.date !== '' ? <Text>{moim.date}</Text> : null}
      </TouchableOpacity>
      {formOpen && formOpen[0] === true && (
        <MyCalender moim={moim} setMoim={setMoim} />
      )}

      <TouchableOpacity onPress={() => formOpenHandler(1)}>
        <Text>시간</Text>
        {moim?.time !== '' ? <Text>{moim.time}</Text> : null}
      </TouchableOpacity>
      {formOpen && formOpen[1] === true && (
        <MyTimePicker moim={moim} setMoim={setMoim} />
      )}

      <TouchableOpacity onPress={() => formOpenHandler(2)}>
        <Text>장소</Text>
      </TouchableOpacity>
      {formOpen && formOpen[2] === true && <Text>장소 선택 컴포넌트</Text>}
      <View>
        <Text>지각비</Text>
        {formOpen && formOpen[3] === true && <Text>지각비 선택 컴포넌트</Text>}
      </View>
    </View>
  );
}

export default CreateMoim;
