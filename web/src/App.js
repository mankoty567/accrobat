import React from 'react';
import './App.css';
import MainPage from './scenes/mainPage/MainPage';
import {
  createMuiTheme,
  CssBaseline,
  ThemeProvider,
} from '@material-ui/core';

export const themeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#2D292B',
    },
    secondary: {
      main: '#4AACC1',
    },
    background: {
      default: '#F0F0F2',
      paper: '#F0F0F2',
    },
    text: {
      secondary: '#647680',
      disabled: '#2D292B',
    },
  },
};

const Theme = createMuiTheme(themeOptions);

Theme.props = {
  MuiButton: {
    color: 'secondary',
  },
  button: {
    color: 'secondary',
  },
};

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <MainPage />
      </ThemeProvider>
    </div>
  );
}

export default App;
