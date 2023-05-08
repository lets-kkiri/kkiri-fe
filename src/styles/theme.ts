import {DefaultTheme} from 'styled-components';

export const lightTheme: DefaultTheme = {
  color: {
    main: '#5968F2',
    main2: '#B0BDFF',
    main3: '#DDE2FC',
    sub: '#FF9270',
    background: '#FFFFFF',
    text: '#3A3A3A',
    grey00: '#F3F3F3',
    grey10: '#E9E9E9',
    grey20: '#DCDCDC',
    grey30: '#D0D0D0',
    grey40: '#C5C5C5',
    grey50: '#AEAEAE',
    grey60: '#999999',
    grey70: '#868686',
    grey80: '#6C6C6C',
    grey90: '#5E5E5E',
    grey100: '#494949',
  },
};

export const darkTheme: DefaultTheme = {
  ...lightTheme,
  color: {
    ...lightTheme.color,
    background: '#3A3A3A',
    text: '#FFFFFF',
    grey100: '#F3F3F3',
    grey90: '#E9E9E9',
    grey80: '#DCDCDC',
    grey70: '#D0D0D0',
    grey60: '#C5C5C5',
    grey50: '#AEAEAE',
    grey40: '#999999',
    grey30: '#868686',
    grey20: '#6C6C6C',
    grey10: '#5E5E5E',
    grey00: '#494949',
  },
};
