import React, {useState} from 'react';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';
import CustomButton from '../Common/Button';

// navigate
import {RouteProp, useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

// Types
interface CompleteCreatePageProps {
  navigation: StackNavigationProp<RootStackParamList, 'CompleteCreate'>;
  moimId: RouteProp<RootStackParamList, 'CompleteCreate'>;
}

// Kkiri Icons
const before_send = require('../../assets/icons/complete_kkiri.svg');
const after_send = require('../../assets/icons/complete_kkiri_shared.svg');

// Styled-components
const ContentContainer = styled.View<{theme: any}>`
  flex: 0.8;
  flex-direction: column;
  padding: 16px;
  background-color: ${({theme}) => theme.color.background};
`;

const HeaderContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* height: 48px; */
`;

const HeaderText = styled.Text`
  font-size: 16px;
`;

const BodyContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const BodyCommentContainer = styled.View`
  /* height: 59px; */
  flex-direction: column;
  margin-top: 36px;
`;

const BodyIconContainer = styled.View`
  flex: 1;
  flex-direction: column;
  padding-top: 50px;
  align-items: center;
`;

const BodyTextLight = styled.Text`
  font-size: 16px;
  font-weight: 200;
  margin-bottom: 6px;
`;

const BodyTextBold = styled.Text`
  font-size: 16px;
  font-weight: 800;
`;

const KkiriContainer = styled.View`
  height: 210px;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 36px;
`;

const ButtonInfo = styled.Text`
  font-size: 12px;
  color: #5968f2;
  margin-bottom: 12px;
`;

const ButtonContainer = styled.View<{theme: any}>`
  flex: 0.2;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 20px;
  align-items: center;
  background-color: ${({theme}) => theme.color.background};
`;

const Gap = styled.View`
  height: 10px;
`;

function CompleteCreate() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CompleteCreate'>>();
  const {moimId} = route.params;
  const [isShared, setIsShared] = useState(false);

  const theme = useSelector((state: RootState) => state.persisted.theme.theme);

  return (
    <>
      <ContentContainer>
        <HeaderContainer>
          <HeaderText>모임 생성 완료</HeaderText>
        </HeaderContainer>
        <BodyContainer>
          <BodyCommentContainer>
            {isShared === true ? (
              <BodyTextLight>친구에게 초대장을 보냈어요!</BodyTextLight>
            ) : (
              <>
                <BodyTextLight>모임이 생성되었어요!</BodyTextLight>
                <BodyTextBold>친구에게 초대장을 보내볼까요?</BodyTextBold>
              </>
            )}
          </BodyCommentContainer>
          <BodyIconContainer>
            <KkiriContainer>
              {isShared === true ? (
                <WithLocalSvg asset={after_send} />
              ) : (
                <WithLocalSvg asset={before_send} />
              )}
            </KkiriContainer>
            {isShared === true ? null : (
              <CustomButton
                text="링크 복사하기"
                status="blur"
                width="short"
                onPress={() => {
                  setIsShared(true);
                }}
              />
            )}
          </BodyIconContainer>
        </BodyContainer>
      </ContentContainer>
      <ButtonContainer theme={theme}>
        {isShared === true ? (
          <>
            <CustomButton
              text="홈으로 돌아가기"
              status="blur"
              width="long"
              onPress={() => {
                navigation.navigate('Home');
              }}
            />
            <Gap />
            <CustomButton
              text="모임 카드 보러가기"
              status="active"
              width="long"
              onPress={() => {
                navigation.navigate('Moim', {moimId: moimId});
              }}
            />
          </>
        ) : (
          <>
            <ButtonInfo>
              친구들에게 링크를 공유하고 모임에 초대해보세요.
            </ButtonInfo>
            <CustomButton
              text="나중에 보낼래요"
              status="active"
              width="long"
              onPress={() => {
                navigation.navigate('Moim', {moimId: moimId});
              }}
            />
          </>
        )}
      </ButtonContainer>
    </>
  );
}

export default CompleteCreate;
