import React, {Suspense} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {emojis} from './Emojis';
import {LocalSvg, WithLocalSvg} from 'react-native-svg';

// Image
import close_blue from '../../assets/icons/close_blue.svg';

// Styled components
const EmojiPickerContainer = styled.View<{windowWidth: number; theme: any}>`
  position: absolute;
  bottom: 68px;
  right: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${({windowWidth}) => windowWidth - 32}px;
  height: 35%;
  z-index: 10;
  border-radius: 15px;
  padding: 16px;
  background-color: ${({theme}) => theme.color.backBlue};
`;

const CloseRow = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 8px;
`;

interface EmojiPickerProp {
  onSelect: (emoji: any) => void;
  onClose: () => void;
}

// Component
const EmojiPicker = ({onSelect, onClose}: EmojiPickerProp) => {
  const windowWidth = Dimensions.get('window').width;

  const theme = useSelector((state: RootState) => state.persisted.theme.theme);

  return (
    <EmojiPickerContainer windowWidth={windowWidth} theme={theme}>
      <CloseRow>
        <TouchableHighlight onPress={onClose}>
          <WithLocalSvg asset={close_blue} />
        </TouchableHighlight>
      </CloseRow>
      <ScrollView style={{width: (44 + 8) * 6}}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {emojis.map(emoji => (
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor="#FFE8E1"
              onPress={() => onSelect(emoji)}
              style={{
                borderRadius: 99,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <WithLocalSvg
                width={42}
                height={42}
                asset={emoji}
                style={{margin: 5}}
              />
            </TouchableHighlight>
          ))}
        </View>
      </ScrollView>
    </EmojiPickerContainer>
  );
};

export default EmojiPicker;
