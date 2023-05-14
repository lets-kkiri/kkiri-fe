import React from 'react';
import {View, Text} from 'react-native';
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

const EmojiText = styled.Text`
  font-size: 16px;
`;

// Types
type EmojiBtnProps = {
  onPress: () => void;
};

const EmojiBtn = ({onPress}: EmojiBtnProps) => {
  return (
    <Container activeOpacity={0.8} onPress={onPress}>
      <WithLocalSvg asset={emoji_default} />
      {/* <EmojiText>😊</EmojiText> */}
    </Container>
  );
};

export default EmojiBtn;
