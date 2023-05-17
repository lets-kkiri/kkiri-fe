import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableHighlight, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

import arrow_down from '../assets/icons/arrow_down.svg';
import worikkiri from '../assets/mypage/worikkiri.svg';
import Dropdown from '../components/MyPage/Dropdown';
import DropdownList from '../components/MyPage/Dropdown';
import axios from 'axios';
import {authInstance} from '../api/axios';
import {requests} from '../api/requests';

// Styled components
const MyPageContainer = styled.SafeAreaView<{theme: any}>`
  /* width: 100%; */
  /* height: 100%; */
  /* padding: 16px;
  padding-top: 0px;
  padding-bottom: 0px; */
  background-color: ${({theme}) => theme.color.background};
  flex: 1;
`;

const FilterButton = styled.TouchableHighlight`
  padding: 4px;
  width: 100px;
  /* border-radius: 99px; */
  /* border-bottom: blue;
  border-width: 1px; */
`;

const FilterRow = styled.View`
  position: relative;
  width: 100%;
  height: 36px;
  /* background-color: red; */
  justify-content: center;
`;

const SummaryContainer = styled.View`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20%;
  /* border-radius: 15px; */
  /* padding: 40px; */
  /* background-color: blue; */
`;

const PeopleContainer = styled.View<{theme: any}>`
  display: flex;
  /* height: 30%; */
  padding: 16px;
  padding-top: 28px;
  padding-bottom: 0px;
  margin-bottom: 8px;
  background-color: ${({theme}) => theme.color.backBlue};
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const KkiriImage = styled.View<{
  containerWidth: number;
  peopleTextHeight: number;
}>`
  /* position: absolute; */
  /* bottom: 0px; */
  /* left: ${({containerWidth}) => (containerWidth - 200) / 2}px; */
  /* top: ${({peopleTextHeight}) => peopleTextHeight}px; */
  /* background-color: red; */
`;

const RowContainer = styled.View<{peopleConHeight: number}>`
  display: flex;
  flex-direction: row;
  height: ${({peopleConHeight}) => peopleConHeight + 100}px;
  /* background-color: blue; */
`;

const PlaceContainer = styled.View<{
  theme: any;
  containerWidth: number;
  peopleConHeight: number;
}>`
  width: ${({containerWidth}) => containerWidth / 2 - 4}px;
  height: ${({peopleConHeight}) => peopleConHeight}px;
  padding: 16px;
  padding-top: 28px;
  background-color: ${({theme}) => theme.color.backBlue};
  border-radius: 15px;
`;

const MyPage = props => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [filterIndex, setFilterIndex] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [today, setToday] = useState<string>('');
  const [myData, setMyData] = useState();

  const filterTypeList = ['최근 한 달', '최근 세 달', '최근 6개월', '최근 1년'];

  const userInfo = useSelector((state: RootState) => state.persisted.user);
  const theme = useSelector((state: RootState) => state.persisted.theme.theme);

  const [containerWidth, setContainerWidth] = useState(0);
  const [peopleConHeight, setPeopleConHeight] = useState(0);
  const [peopleTextHeight, setPeopleTextHeight] = useState(0);

  const onPeopleContainerLayout = event => {
    const {width, height} = event.nativeEvent.layout;
    setContainerWidth(width);
    setPeopleConHeight(height);
  };

  const onPeopleTextLayout = event => {
    const {height} = event.nativeEvent.layout;
    setPeopleTextHeight(height);
  };

  const onDropdownPressHandler = index => {
    setFilterIndex(index);
  };

  useEffect(() => {
    const periodList = ['one-month', 'three-month', 'six-month', 'one-year'];
    const get_mypage = () => {
      const {data} = authInstance.get(
        requests.GET_MYPAGE(periodList[filterIndex]),
      );
      console.log('my page data :', data);
      setMyData(data);
    };
    get_mypage();
  }, [filterIndex]);
  return (
    <MyPageContainer theme={theme}>
      <FilterRow style={{paddingLeft: 16}}>
        <FilterButton
          activeOpacity={0.6}
          underlayColor={theme.color.orange3}
          onPress={() => setShowDropDown(prev => !prev)}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 12}}>{filterTypeList[filterIndex]}</Text>
            <WithLocalSvg asset={arrow_down} />
          </View>
        </FilterButton>
        {showDropDown ? (
          <DropdownList
            textList={filterTypeList}
            onPress={onDropdownPressHandler}
          />
        ) : null}
      </FilterRow>
      <ScrollView
        style={{
          marginHorizontal: 16,
        }}>
        <SummaryContainer>
          <Text style={{color: theme.color.text}}>
            {userInfo.nickname}님 {filterTypeList[filterIndex]}간
          </Text>
          <Text style={{color: theme.color.text}}>
            총 {'10'}번의 약속이 있었군요!
          </Text>
          <Text style={{fontSize: 10, marginTop: 8, color: theme.color.blue}}>
            {'2023년 04일 10일'} - {'5월 10일'}
          </Text>
        </SummaryContainer>
        <PeopleContainer theme={theme} onLayout={onPeopleContainerLayout}>
          <View onLayout={onPeopleTextLayout} style={{width: '100%'}}>
            <Text style={{color: theme.color.text}}>
              {filterTypeList[filterIndex]}간
            </Text>
            <Text style={{position: 'relative', color: theme.color.text}}>
              <Text>{'이은지'}</Text>
              님을 가장 많이 만났어요!
            </Text>
          </View>
          <KkiriImage
            containerWidth={containerWidth}
            peopleTextHeight={peopleTextHeight}>
            <WithLocalSvg
              asset={worikkiri}
              // style={{position: 'absolute', bottom: 0}}
            />
          </KkiriImage>
        </PeopleContainer>
        <RowContainer peopleConHeight={peopleConHeight}>
          <PlaceContainer
            containerWidth={containerWidth}
            peopleConHeight={peopleConHeight}
            style={{marginRight: 8}}>
            <Text style={{color: theme.color.text}}>
              <Text style={{color: theme.color.text}}>{'용산구'}</Text>를
              좋아하시는군요
            </Text>
          </PlaceContainer>
          <PlaceContainer
            containerWidth={containerWidth}
            peopleConHeight={peopleConHeight}>
            <Text style={{color: theme.color.text}}>
              <Text style={{color: theme.color.text}}>{}</Text>
              님을 가장 많이 만났어요!
            </Text>
          </PlaceContainer>
        </RowContainer>
      </ScrollView>
    </MyPageContainer>
  );
};

export default MyPage;
