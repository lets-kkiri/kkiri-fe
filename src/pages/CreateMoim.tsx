import React, {useCallback, useEffect, useState} from 'react';
import {Text, View, Switch, Modal} from 'react-native';
import MyCalender from '../components/CreateMoim/MyCalender';
import {MoimType} from '../slices/moim';
import MyTimePicker from '../components/CreateMoim/MyTimePicker';
import CustomButton from '../components/Common/Button';
import {WithLocalSvg} from 'react-native-svg';
import styled from 'styled-components/native';
import PickPlace from '../components/CreateMoim/PickPlace';

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
  justify-content: flex-end;
  padding-bottom: 20px;
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
      if (idx === -1) {
        return setFormOpen([...newFormOpen]);
      }
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
    if (canPost === false) {
      console.log('아직 POST 못하지롱');
    }
    console.log(moim);
    // 버튼 클릭시 Client 단에서 URL 생성
    // URL 생성 후 해당 정보 담아서 POST 요청
    // 성공한 경우 성공 Page로 이동
    // 성공 Page에서는 URL 확인 및 공유 가능
    // 공유 버튼 클릭시 네이티브 공유
    // 카드 확인하기 -> 카드 페이지로 이동
    // 홈으로 돌아가기 -> 홈으로 이동
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
          onFocus={() => formOpenHandler(-1)}
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
          {moim?.placeName !== '' ? <Text>{moim.placeName}</Text> : null}
        </ListContainer>
        {formOpen && formOpen[2] === true && (
          <View>
            <Modal>
              <PickPlace
                moim={moim}
                setMoim={setMoim}
                setFormOpen={setFormOpen}
              />
            </Modal>
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
                  onFocus={() => formOpenHandler(-1)}
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
