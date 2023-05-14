import {createSlice} from '@reduxjs/toolkit';
import {lightTheme, darkTheme} from '../styles/theme';
import {DefaultTheme} from 'styled-components/native';

type initialStateType = {
  [key: string]: boolean | DefaultTheme;
  darkmode: true | false;
  theme: DefaultTheme;
};
const initialState: initialStateType = {darkmode: false, theme: lightTheme};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.darkmode = !state.darkmode;
      state.theme = state.darkmode ? darkTheme : lightTheme;
    },
  },
});

export const {toggleTheme} = themeSlice.actions;

export default themeSlice;
