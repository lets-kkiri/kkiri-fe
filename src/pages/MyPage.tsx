import React, {useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {RootState} from '../store/index';
import styled from 'styled-components/native';
import DropDownPicker from 'react-native-dropdown-picker';

// Styled component

const MyPageContainer = styled.View`
  flex-direction: column;
  align-items: center;
`;

const FilterContainer = styled.View`
  flex-direction: row;
  width: 343px;
  height: 30px;
  border: 1px;
`;

const FilterTouchable = styled.TouchableOpacity``;

const PeriodFilter = styled.Text``;

const FilterIconContainer = styled.View`
  height: 12px;
  width: 12px;
  align-items: center;
  justify-content: center;
`;

const PeriodContainer = styled.View``;

const PeriodText = styled.Text``;

const HeaderContainer = styled.View``;

const BannerContainer = styled.View``;

const SmallBannerContainer = styled.View``;

const BodyContainer = styled.View``;

const RankingHeader = styled.View``;

const RankingContainer = styled.ScrollView``;

const BtnContainer = styled.TouchableHighlight``;

const Banner = ({nickname, period, count, startDay, endDay}) => {
  if (!nickname || !period || !count || !startDay) {
    return null;
  }
  return (
    <BannerContainer>
      <View>
        <Text>
          {nickname}님, 최근 {period}간
        </Text>
        <Text>총 {count}번의 약속이 있었군요!</Text>
      </View>
      <View>
        <Text>
          {startDay} ~ {endDay}
        </Text>
      </View>
    </BannerContainer>
  );
};

const FavoriteMate = ({period, bestMember}) => {
  if (!period || !bestMember) {
    return null;
  }
  return (
    <BannerContainer>
      <Text>{period}간</Text>
      <Text>{bestMember}님</Text>
      <Text>을 가장 많이 만났어요!</Text>
    </BannerContainer>
  );
};

const FavoriteLoc = ({location}) => {
  if (!location) {
    return null;
  }
  return (
    <SmallBannerContainer>
      <Text>{location}</Text>
      <Text>(을)를</Text>
      <Text>좋아하시는군요</Text>
    </SmallBannerContainer>
  );
};

const FavoriteTime = ({time}) => {
  if (!time) {
    return null;
  }
  return (
    <SmallBannerContainer>
      <Text>주로</Text>
      <Text>{time}</Text>
      <Text>에</Text>
      <Text>만나는 편이네요</Text>
    </SmallBannerContainer>
  );
};

// Icons
const dateIcon = require('../assets/icons/moim_date.svg');

function MyPage() {
  const user = useSelector((state: RootState) => state.persisted.user);
  const [isDetail, setIsDetail] = useState(false);
  const [filter, setFilter] = useState(0);

  // filter를 위한 요소
  const [filterOpen, setFilterOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: '최근 한 달간', value: 0},
    {label: '최근 세 달간', value: 1},
    {label: '최근 반 년간', value: 2},
    {label: '최근 일 년간', value: 3},
  ]);

  const periodList = ['한 달', '세 달', '반 년', '일 년'];

  const tmpData = {
    month: {
      startDay: '2023-04-10', // e.g. "2023-04-10"
      endDay: '2023-05-10', // e.g. "2023-05-10"
      meetCnt: 10, //e.g. 10,
      mostMem: '이은지', //e.g. "이은지",
      mostLoc: '용산구', //e.g. "용산구",
      mostTime: '저녁 시간대', //e.g. "저녁시간대",
      memList: [
        {
          rank: 1,
          kakaoId: '01',
          profileImage: '',
          nickname: '이은지',
          cnt: 6,
        },
        {
          rank: 2,
          kakaoId: '02',
          profileImage: '',
          nickname: '박유진',
          cnt: 5,
        },
        {
          rank: 3,
          kakaoId: '03',
          profileImage: '',
          nickname: '김준호',
          cnt: 4,
        },
      ],
    },
    trimestral: {},
    semiannual: {},
    annual: {},
  };

  return (
    <MyPageContainer>
      <FilterContainer>
        <FilterTouchable>
          {/* <PeriodFilter>{}</PeriodFilter>
          <FilterIconContainer>
            <WithLocalSvg asset={dateIcon} height={6} width={12} />
          </FilterIconContainer> */}
          <DropDownPicker
            open={filterOpen}
            value={value}
            items={items}
            setOpen={setFilterOpen}
            setValue={setValue}
            setItems={setItems}
          />
        </FilterTouchable>
        <PeriodContainer>
          <PeriodText>{}</PeriodText>
        </PeriodContainer>
      </FilterContainer>
      <HeaderContainer>
        {isDetail === true ? (
          <FavoriteMate
            period={periodList[filter]}
            bestMember={tmpData.month.mostMem}
          />
        ) : (
          <Banner
            nickname={user.nickname}
            period={periodList[filter]}
            count={tmpData.month.meetCnt}
            startDay={tmpData.month.startDay}
            endDay={tmpData.month.endDay}
          />
        )}
      </HeaderContainer>
      <BodyContainer>
        {isDetail === true ? (
          <View>
            <RankingHeader>
              <Text>만남 횟수 순위</Text>
              <BtnContainer onPress={() => setIsDetail(false)}>
                <WithLocalSvg asset={dateIcon} height={20} width={20} />
              </BtnContainer>
            </RankingHeader>
            <RankingContainer>{/* <FlatList /> */}</RankingContainer>
          </View>
        ) : (
          <>
            <FavoriteMate
              period={periodList[filter]}
              bestMember={tmpData.month.mostMem}
            />
            <View>
              <FavoriteLoc location={tmpData.month.mostLoc} />
              <FavoriteTime time={tmpData.month.mostTime} />
            </View>
          </>
        )}
      </BodyContainer>
    </MyPageContainer>
  );
}

export default MyPage;
