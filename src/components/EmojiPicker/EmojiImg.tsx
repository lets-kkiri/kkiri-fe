import React from 'react';
import {Image, Text, TouchableHighlight, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import styled from 'styled-components/native';

// Styled Component
const EmojiContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  width: 24px;
  height: 24px;
  z-index: 11;
`;

type EmojiImgProp = {emoji: {id: number; src: string}};

const EmojiImg = ({emoji}) => {
  return (
    <TouchableHighlight style={{backgroundColor: 'red'}}>
      <Image
        source={{uri: emoji.src}}
        style={{
          width: 24,
          height: 24,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </TouchableHighlight>
  );
};

export default EmojiImg;
