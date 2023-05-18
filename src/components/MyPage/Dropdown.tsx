import React from 'react';
import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {RootState} from '../../store';

const Container = styled.View<{theme: number}>`
  position: absolute;
  background-color: ${({theme}) => theme.color.background};
  z-index: 20;
  /* padding: 4px; */
  background-color: ${({theme}) => theme.color.backBlue};
  top: 40px;
  left: 16px;
  border-radius: 15px;
`;

const ListItem = styled.TouchableHighlight`
  padding-left: 16px;
  padding-right: 16px;
  height: 40px;
  justify-content: center;
  text-align: center;
  align-items: center;
  border-radius: 99px;
  :active {
    color: red;
  }
`;

const ListText = styled.Text`
  font-size: 12px;
`;

interface DropDownListProp {
  textList: string[];
  onPress: (index: number) => void;
}
const DropdownList = ({textList, onPress}: DropDownListProp) => {
  const theme = useSelector((state: RootState) => state.persisted.theme.theme);

  return (
    <Container theme={theme}>
      {textList.map((text, index) => (
        <ListItem
          key={index}
          activeOpacity={0.6}
          underlayColor={theme.color.orange3}
          onPress={() => onPress(index)}>
          <ListText>{text}</ListText>
        </ListItem>
      ))}
    </Container>
  );
};

export default DropdownList;
