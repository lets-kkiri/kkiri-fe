import {DefaultTheme} from 'styled-components/native';

// colors
const lightColors = {
  // 기본적으로 필요한 속성
  primary: 'rgb(255, 45, 85)',
  card: 'rgb(255, 255, 255)',
  border: 'rgb(199, 199, 204)',
  notification: 'rgb(255, 69, 58)',
  // 커스텀
  green: '#DCF861',
  green2: '#F7FFD2',
  blue: '#5968F2',
  blue2: '#B0BDFF',
  blue3: '#DDE2FC',
  backBlue: '#F8F9FF',
  orange: '#FF9270',
  orange2: '#FFD8CC',
  orange3: '#FFF5F2',
  background: '#FFFFFF',
  text: '#3A3A3A',
  white: '#FFFFFF',
  grey20: '#F4F4F4',
  grey40: '#E2E2E2',
  grey60: '#D0D0D0',
  grey80: '#AEAEAE',
  grey90: '#5E5E5E',
  black: '#3A3A3A',
};

const darkColors = {
  ...lightColors,
  background: '#3A3A3A',
  text: '#FFFFFF',
  white: '#3A3A3A',
  grey20: '#5E5E5E',
  grey40: '#AEAEAE',
  grey60: '#D0D0D0',
  grey80: '#E2E2E2',
  grey90: '#F4F4F4',
  black: '#FFFFFF',
};

const fonts = {
  thin: 'Pretendard-Thin',
};

export const lightTheme: DefaultTheme = {
  color: lightColors,
  font: fonts,
};

export const darkTheme: DefaultTheme = {
  color: darkColors,
};
