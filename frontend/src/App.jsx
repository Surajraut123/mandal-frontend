import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme/theme';
import Home from './home/Home';
import './App.css';
import { Toaster } from 'react-hot-toast';
import 'react-big-calendar/lib/css/react-big-calendar.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster 
        position="top-right"
        reverseOrder={false} 
      />
      <Home />
    </ThemeProvider>
    
  );
}

export default App;
