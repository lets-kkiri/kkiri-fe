import React from 'react';
import {View, Text, Button, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';

// svg
import Pick from '../../assets/icons/pick.svg';
import Grade from '../../assets/icons/grade.svg';
import Bear from '../../assets/icons/bear.svg';

interface AboutProps {
  setSideModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Container = styled.View`
  position: absolute;
  right: 0;
  width: 260px;
  height: 100%;
  background-color: white;
  padding: 40px 20px;
`;

const Padding = styled.View`
  padding: 0 10px;
`;

const Row = styled.View`
  flex-direction: row;
`;

const Hr = styled.View`
  border-bottom-width: 1px;
  border-color: #d0d0d0;
  margin: 30px 0;
`;

const MainFont = styled.Text`
  color: #5968f2;
  font-weight: bold;
  margin: 0 10px;
`;

const SubFont = styled.Text`
  padding: 0 10px;
`;

const AboutMoim = ({setSideModal}: AboutProps) => {
  // redux에서 가져온 유저 정보
  const users = [
    {
      id: 'yjp8842',
    },
    {
      id: 'yjp8842',
    },
    {
      id: 'yjp8842',
    },
    {
      id: 'yjp8842',
    },
    {
      id: 'yjp8842',
    },
    {
      id: 'yjp8842',
    },
  ];

  return (
    <Container>
      <Padding>
        <Row>
          <WithLocalSvg width={15} height={20} asset={Pick} />
          <MainFont>오늘의 목적지</MainFont>
        </Row>
        <SubFont style={{marginTop: 15}}>
          서울특별시 강서구 양천로 30길 115 2층 00카페
        </SubFont>
      </Padding>
      <Hr />
      <Padding style={{maxHeight: 300}}>
        <ScrollView>
          <Row>
            <WithLocalSvg width={15} height={20} asset={Grade} />
            <MainFont>현재 목적지 접근 순위</MainFont>
          </Row>
          {users.map((user, index) => {
            return (
              <Row style={{paddingHorizontal: 15, marginTop: 25}}>
                <WithLocalSvg width={35} height={28} asset={Bear} />
                <SubFont>
                  {index + 1}등 {user.id}
                </SubFont>
              </Row>
            );
          })}
        </ScrollView>
      </Padding>
      <Hr />
      <Padding>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <Text>가는 길에</Text>
          <MainFont>00번</MainFont>
          <Text>재촉당했어요!</Text>
        </View>
        <Row>
          <Text>친구들을</Text>
          <MainFont>00번</MainFont>
          <Text>재촉했어요!</Text>
        </Row>
      </Padding>
      <Hr />
      <Button title="닫기" onPress={() => setSideModal(false)} />
    </Container>
  );
};

export default AboutMoim;
