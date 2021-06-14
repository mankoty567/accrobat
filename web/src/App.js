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
      main: '#4a6dc1',
    },
    background: {
      default: '#F2E8C7',
      paper: '#FFFCF0',
    },
    text: {
      secondary: '#647680',
      disabled: '#2D292B',
    },
    error: {
      main: '#961415',
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
