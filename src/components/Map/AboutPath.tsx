import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';
import NotiBox from '../Common/NotiBox';
import {useAppDispatch} from '../../store';
import {guidesPost} from '../../slices/guidesSlice';
import Pencil from '../../assets/icons/pencil.svg';
import CustomButton from '../Common/Button';

interface PathProps {
  startDraw: boolean;
  setStartDraw: React.Dispatch<React.SetStateAction<boolean>>;
  sendpath: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType: React.Dispatch<React.SetStateAction<string>>;
  setSendpath: React.Dispatch<React.SetStateAction<boolean>>;
  drawpoint: PathState | null;
  setDrawpoint: React.Dispatch<React.SetStateAction<PathState | null>>;
  drawpath: PathState[];
  setDrawpath: React.Dispatch<React.SetStateAction<PathState[]>>;
  nickname: string;
}

interface PathState {
  latitude: number;
  longitude: number;
}

const DrawNoti = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  height: 50;
  width: 90%;
  border-style: solid;
  border-color: #5968f2;
  border-width: 1;
  border-radius: 15;
  margin-top: 15px;
  padding-left: 20px;
`;

const AboutPath = ({
  startDraw,
  setStartDraw,
  sendpath,
  setModalVisible,
  setModalType,
  setSendpath,
  drawpoint,
  setDrawpoint,
  drawpath,
  setDrawpath,
  nickname,
}: PathProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (drawpoint) {
      setDrawpath(prevPoint => [...prevPoint, drawpoint]);
    }
  }, [drawpoint]);

  // 서버로 그린 경로 보내는 함수
  function sendPath() {
    // 임시 데이터
    const postData = {
      receiverKakaoId: '2783374648',
      path: drawpath,
    };
    dispatch(guidesPost(postData));
    setModalVisible(true);
    setModalType('sendpath');
    setSendpath(false);
    setStartDraw(false);
  }

  return (
    <>
      {startDraw === false ? (
        <NotiBox
          nickname={nickname}
          mainTitle="님이 도움을 요청했어요"
          subTitle="길을 헤매는 친구에게 길 안내를 보내주세요!"
          onPress={() => setStartDraw(true)}
        />
      ) : sendpath === false ? (
        <View style={{position: 'absolute', alignItems: 'center'}}>
          <DrawNoti>
            <WithLocalSvg
              asset={Pencil}
              width={16}
              height={18}
              style={{marginRight: 10}}
            />
            <Text style={{color: '#5968F2', fontWeight: '600'}}>
              손가락으로 길을 그려 친구에게 보내주세요!
            </Text>
          </DrawNoti>
          <View
            style={{
              top: 580,
              left: 0,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <CustomButton
              text="다시 그리기"
              status="disabled"
              width="short"
              onPress={() => {
                setDrawpoint(null);
                setDrawpath([]);
              }}
            />
            <CustomButton
              text="경로 전송하기"
              status="active"
              width="short"
              onPress={() => {
                setDrawpoint(null);
                setDrawpath([]);
                sendPath();
                console.log(drawpath);
              }}
            />
          </View>
        </View>
      ) : null}
    </>
  );
};

export default AboutPath;
