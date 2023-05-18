import React, {useEffect, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';
import NotiBox from '../Common/NotiBox';
import {useAppDispatch} from '../../store';
import {guidesPost} from '../../slices/guidesSlice';
import Pencil from '../../assets/icons/pencil.svg';
import CustomButton from '../Common/Button';
import notiSlice, {notiType} from '../../slices/noti';
import * as Animatable from 'react-native-animatable';

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
  noti: notiType;
  kakaoId: string;
}

interface PathState {
  latitude: number;
  longitude: number;
}

const DrawNoti = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  height: 50px;
  width: 90%;
  border-style: solid;
  border-color: #5968f2;
  border-width: 1px;
  border-radius: 15px;
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
  noti,
  kakaoId,
}: PathProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (drawpoint) {
      setDrawpath(prevPoint => [...prevPoint, drawpoint]);
    }
  }, [drawpoint]);

  // 서버로 그린 경로 보내는 함수
  function sendPath(user: string) {
    // 임시 데이터
    const postData = {
      receiverKakaoId: user,
      path: drawpath,
    };
    if (drawpath.length > 1) {
      dispatch(guidesPost(postData));
      setModalVisible(true);
      setModalType('sendpath');
      setSendpath(false);
      setStartDraw(false);
    } else {
      Alert.alert('두 개 이상의 포인트를 찍어주세요!');
    }
  }

  return (
    <>
      {startDraw === false ? (
        <NotiBox
          nickname={nickname}
          mainTitle="님이 도움을 요청했어요"
          subTitle="길을 헤매는 친구에게 길 안내를 보내주세요!"
          onPress={() => setStartDraw(true)}
          type="map"
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
                if (drawpath.length < 2) {
                  return;
                } else {
                  setDrawpoint(null);
                  setDrawpath([]);
                  sendPath(kakaoId);
                  dispatch(notiSlice.actions.clickNoti(noti));
                }
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
