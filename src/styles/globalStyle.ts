import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    color: ${props => props.theme.color.text};
    background-color: ${props => props.theme.color.background};
  }
`;

export default GlobalStyle;
