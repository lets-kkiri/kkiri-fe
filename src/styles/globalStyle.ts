import {createGlobalStyle} from 'styled-components/native';

const GlobalStyle = createGlobalStyle`
  body {
    /* color: ${theme => theme.text}; */
    /* background-color: ${theme => theme.background}; */
    font-family: 'Pretendard';
    transition: all 0.50s linear;
  }
`;

export default GlobalStyle;
