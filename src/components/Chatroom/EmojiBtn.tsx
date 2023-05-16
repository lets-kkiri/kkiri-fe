import React, {Suspense} from 'react';
import {View, Text, ImageSourcePropType} from 'react-native';
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

// Types
type EmojiBtnProps = {
  onPress: () => void;
  isEmojiSelected: boolean;
  selectedEmoji: string;
};

const EmojiBtn = ({onPress, isEmojiSelected, selectedEmoji}: EmojiBtnProps) => {
  return (
    <Container activeOpacity={0.8} onPress={onPress}>
      <Suspense fallback={<Text>...</Text>}>
        {!isEmojiSelected ? (
          <WithLocalSvg asset={emoji_default} width={32} height={32} />
        ) : (
          <WithLocalSvg asset={selectedEmoji} width={32} height={32} />
        )}
      </Suspense>
    </Container>
  );
};

export default EmojiBtn;
