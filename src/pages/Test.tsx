import React from 'react';
import {TextInput, View} from 'react-native';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DismissKeyboardView from '../components/DismissKeyboardView';

const Container = styled.View`
  display: flex;
  height: 1000px;
  justify-content: center;
`;

const Test = () => {
  return (
    <DismissKeyboardView>
      <Container>
        <TextInput placeholder="테스트" />
      </Container>
    </DismissKeyboardView>
  );
};

export default Test;
