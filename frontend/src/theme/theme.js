import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35',
      light: '#FF8A65',
      dark: '#E64A19',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D32F2F',
      light: '#F44336',
      dark: '#B71C1C',
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#FFC107',
      light: '#FFEB3B',
      dark: '#FF8F00',
    },
    background: {
      default: '#FFF8E1',
      paper: '#FFFFFF',
      gradient: 'linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%)',
    },
    text: {
      primary: '#2E2E2E',
      secondary: '#5D4037',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#2E2E2E',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#2E2E2E',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#2E2E2E',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#2E2E2E',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#2E2E2E',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#2E2E2E',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(255, 107, 53, 0.1)',
    '0px 4px 8px rgba(255, 107, 53, 0.15)',
    '0px 8px 16px rgba(255, 107, 53, 0.2)',
    '0px 12px 24px rgba(255, 107, 53, 0.25)',
    // Add more custom shadows as needed
    ...Array(20).fill('0px 2px 4px rgba(0,0,0,0.1)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 20px rgba(255, 107, 53, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #FF6B35 30%, #FF8A65 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #E64A19 30%, #FF6B35 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 32px rgba(255, 107, 53, 0.15)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 16px 48px rgba(255, 107, 53, 0.25)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF6B35',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF6B35',
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            color: '#FF6B35',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#FF6B35',
          color: '#FFFFFF',
          fontWeight: 600,
        },
        root: {
          borderBottom: '1px solid rgba(255, 107, 53, 0.1)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #FF6B35 30%, #FFC107 90%)',
          fontWeight: 600,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;
