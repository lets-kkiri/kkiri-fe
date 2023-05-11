import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  ScrollView,
} from 'react-native';
import MyCalender from '../components/CreateMoim/MyCalender';
import {MoimType} from '../slices/moim';
import MyTimePicker from '../components/CreateMoim/MyTimePicker';
import CustomButton from '../components/Common/Button';
import {WithLocalSvg} from 'react-native-svg';
import styled from 'styled-components/native';

// Styled component
const CreateMoimConatiner = styled.View`
  flex-direction: column;
  flex: 1;
`;

const ScrollViewStyled = styled.ScrollView`
  flex: 0.85;
`;

const HeaderContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HeaderText = styled.Text`
  font-size: 16px;
`;

const HeaderStepContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  width: 58px;
  height: 6px;
`;

const HeaderStep = styled.View`
  height: 6px;
  width: 6px;
  border-radius: 6px;
  background-color: ${({isComplete}) =>
    isComplete === true ? '#FF9270' : '#D0D0D0'};
`;

const MoimNameInput = styled.TextInput`
  margin: 30px 24px 30px 24px;
  padding: 8px;
  border-bottom-width: 1.5px;
  border-bottom-color: #5968f2;
  font-size: 18px;
  font-weight: 600;
`;

const ListContainer = styled.TouchableOpacity`
  flex-direction: row;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  margin: 0px 24px 0px 24px;
  padding: 12px 0px 12px 0px;
  border-bottom-width: 1px;
  border-bottom-color: #f4f4f4;
`;

const ListViewContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 24px 12px 24px;
`;

const IconConatiner = styled.View`
  height: 24px;
  width: 24px;
  margin-right: 12px;
  align-items: center;
  justify-content: center;
`;

const ViewBinder = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FeeInput = styled.TextInput`
  height: 24px;
  margin: 0px;
  padding: 0px;
`;

const ButtonContainer = styled.View`
  flex: 0.15;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// Icons
const dateIcon = require('../assets/icons/moim_date.svg');
const timeIcon = require('../assets/icons/moim_time.svg');
const locationIcon = require('../assets/icons/moim_location.svg');
const feeIcon = require('../assets/icons/moim_fee.svg');

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

  const [formOpen, setFormOpen] = useState([false, false, false]);
  const [canPost, setCanPost] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [step, setStep] = useState(0);

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

  const toggleSwitch = () => {
    if (isEnabled === true) {
      const newMoim = {...moim};
      newMoim.lateFee = 0;
      setMoim({...newMoim});
    }
    setIsEnabled(!isEnabled);
  };

  const postMoim = () => {
    console.log(moim);
  };

  useEffect(() => {
    let stepCnt = 0;
    if (moim.date !== '') {
      stepCnt += 1;
    }
    if (moim.time !== '') {
      stepCnt += 1;
    }
    if (moim.placeName !== '') {
      stepCnt += 1;
    }
    setStep(stepCnt);
    if (stepCnt === 3 && moim.name !== '') {
      setCanPost(true);
    } else {
      setCanPost(false);
    }
  }, [moim]);

  const dateConvertKR = dateStr => {
    let [year, month, day] = dateStr.split('-');
    return `${year}년 ${month}월 ${day}일`;
  };

  const timeConvertKR = timeStr => {
    let [hour, minute] = timeStr.split(':');
    if (Number(hour) > 12) {
      return `오후 ${Number(hour) - 12}시 ${minute}분`;
    }
    return `오전 ${Number(hour)}시 ${minute}분`;
  };

  return (
    <CreateMoimConatiner>
      <ScrollViewStyled>
        <HeaderContainer>
          <HeaderText>모임 생성 중</HeaderText>
          <HeaderStepContainer>
            <HeaderStep isComplete={step > 0} />
            <HeaderStep isComplete={step > 1} />
            <HeaderStep isComplete={step > 2} />
          </HeaderStepContainer>
        </HeaderContainer>
        <MoimNameInput
          value={moim.name}
          onChangeText={text => {
            const newMoim = {...moim};
            newMoim.name = text;
            setMoim(newMoim);
          }}
          placeholder="모임 이름을 입력해주세요."
        />

        <ListContainer onPress={() => formOpenHandler(0)}>
          <ViewBinder>
            <IconConatiner>
              <WithLocalSvg asset={dateIcon} height={20} />
            </IconConatiner>
            <Text>날짜</Text>
          </ViewBinder>
          {moim?.date !== '' ? <Text>{dateConvertKR(moim.date)}</Text> : null}
        </ListContainer>
        {formOpen && formOpen[0] === true && (
          <MyCalender moim={moim} setMoim={setMoim} />
        )}

        <ListContainer onPress={() => formOpenHandler(1)}>
          <ViewBinder>
            <IconConatiner>
              <WithLocalSvg asset={timeIcon} height={20} />
            </IconConatiner>
            <Text>시간</Text>
          </ViewBinder>
          {moim?.time !== '' ? <Text>{timeConvertKR(moim.time)}</Text> : null}
        </ListContainer>
        {formOpen && formOpen[1] === true && (
          <MyTimePicker moim={moim} setMoim={setMoim} />
        )}

        <ListContainer onPress={() => formOpenHandler(2)}>
          <ViewBinder>
            <IconConatiner>
              <WithLocalSvg asset={locationIcon} height={20} />
            </IconConatiner>
            <Text>장소</Text>
          </ViewBinder>
        </ListContainer>
        {formOpen && formOpen[2] === true && (
          <View>
            <TextInput
              placeholder="임시 장소 선택 컴포넌트"
              value={moim.placeName}
              onChangeText={text => {
                const newMoim = {...moim};
                newMoim.placeName = text;
                setMoim(newMoim);
              }}
            />
          </View>
        )}

        <ListViewContainer>
          <ViewBinder>
            <IconConatiner>
              <WithLocalSvg asset={feeIcon} height={20} />
            </IconConatiner>
            <Text>지각비</Text>
          </ViewBinder>
          <ViewBinder>
            {isEnabled === true && (
              <ViewBinder>
                <FeeInput
                  placeholder="0"
                  keyboardType="numeric"
                  textAlign="right"
                  value={moim?.lateFee === 0 ? '' : moim?.lateFee.toString()}
                  onChangeText={text => {
                    const newMoim = {...moim};
                    newMoim.lateFee = parseInt(text, 10);
                    if (text === '') {
                      newMoim.lateFee = 0;
                    }
                    setMoim(newMoim);
                  }}
                />
                <Text>원</Text>
              </ViewBinder>
            )}
            <Switch
              trackColor={{false: '#CFCFCF', true: '#B0BDFF'}}
              thumbColor={'#FFFFFF'}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </ViewBinder>
        </ListViewContainer>
      </ScrollViewStyled>

      <ButtonContainer>
        <CustomButton
          text="모임 생성하기"
          status={canPost === true ? 'active' : 'disabled'}
          width="long"
          onPress={postMoim}
        />
      </ButtonContainer>
    </CreateMoimConatiner>
  );
}

export default CreateMoim;
