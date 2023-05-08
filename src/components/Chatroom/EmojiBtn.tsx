import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {WithLocalSvg} from 'react-native-svg';

// Icons
import emoji_default from '../../assets/icons/emoji_default.svg';

// Styled components
const Container = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff9270;
`;

const EmojiBtn = () => {
  return (
    <Container>
      <WithLocalSvg asset={emoji_default} />
    </Container>
  );
};

export default EmojiBtn;
