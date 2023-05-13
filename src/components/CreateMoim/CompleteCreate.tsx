import React from 'react';
import {Text, View} from 'react-native';

const ContentContainer = styled.ScrollView`
  flex: 0.7;
`;

const HeaderContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HeaderText = styled.Text`
  font-size: 16px;
`;

const ButtonContainer = styled.View`
  flex: 0.3;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 20px;
  align-items: center;
`;

function CompleteCreate() {
  return (
    <ContentContainer>
      <HeaderContainer>
        <HeaderText>마이페이지</HeaderText>
      </HeaderContainer>
    </ContentContainer>
  );
}

export default CompleteCreate;
