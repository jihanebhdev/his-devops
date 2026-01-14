import { createTheme } from '@mui/material/styles';
export const createAppTheme = (mode = 'light') => {
  const isDark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#1976d2' : '#1976d2',
        light: isDark ? '#42a5f5' : '#42a5f5',
        dark: isDark ? '#1565c0' : '#1565c0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#dc004e' : '#dc004e',
        light: isDark ? '#ff5983' : '#ff5983',
        dark: isDark ? '#9a0036' : '#9a0036',
        contrastText: '#ffffff',
      },
      success: {
        main: isDark ? '#2e7d32' : '#2e7d32',
        light: isDark ? '#4caf50' : '#4caf50',
        dark: isDark ? '#1b5e20' : '#1b5e20',
      },
      warning: {
        main: isDark ? '#ed6c02' : '#ed6c02',
        light: isDark ? '#ff9800' : '#ff9800',
        dark: isDark ? '#e65100' : '#e65100',
      },
      error: {
        main: isDark ? '#d32f2f' : '#d32f2f',
        light: isDark ? '#ef5350' : '#ef5350',
        dark: isDark ? '#c62828' : '#c62828',
      },
      info: {
        main: isDark ? '#0288d1' : '#0288d1',
        light: isDark ? '#03a9f4' : '#03a9f4',
        dark: isDark ? '#01579b' : '#01579b',
      },
      background: {
        default: isDark ? '#05070a' : '#ffffff',
        paper: isDark ? '#0c1017' : '#ffffff',
      },
      text: {
        primary: isDark ? '#ffffff' : '#1a1a1a',
        secondary: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.75rem',
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 4,
    },
    shadows: [
      'none',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.08)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.08)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.1)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.1)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.12)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.12)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.14)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.14)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.16)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.16)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.18)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.18)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.2)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.2)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.22)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.22)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.24)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.24)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.26)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.26)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.28)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.28)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.3)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.3)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.32)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.32)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.34)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.34)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.36)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.36)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.38)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.38)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.4)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.4)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.42)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.42)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.44)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.44)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.46)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.46)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.48)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.48)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.5)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.5)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.52)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.52)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.54)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.54)',
      isDark ? '0px 0px 0px 1px rgba(255, 255, 255, 0.56)' : '0px 0px 0px 1px rgba(0, 0, 0, 0.56)',
    ],
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            boxShadow: 'none',
            backgroundImage: 'none',
            backgroundColor: isDark ? '#0c1017' : '#ffffff',
            transition: 'all 0.3s ease-in-out',
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.05)'
              : '1px solid rgba(0, 0, 0, 0.05)',
            '&:hover': {
              border: isDark
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '24px',
            '&:last-child': {
              paddingBottom: '24px',
            },
            color: isDark ? '#ffffff' : '#1a1a1a',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 4,
            boxShadow: 'none',
            backgroundColor: isDark ? '#0c1017' : '#ffffff',
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.05)'
              : '1px solid rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 24px',
            boxShadow: 'none',
            border: 'none',
          },
          contained: {
            backgroundColor: isDark
              ? 'rgba(25, 118, 210, 0.15)'
              : 'rgba(25, 118, 210, 0.08)',
            color: isDark ? '#42a5f5' : '#1976d2',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: isDark
                ? 'rgba(25, 118, 210, 0.2)'
                : 'rgba(25, 118, 210, 0.12)',
              boxShadow: 'none',
            },
          },
          outlined: {
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.12)'
              : '1px solid rgba(0, 0, 0, 0.12)',
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.04)',
              border: isDark
                ? '1px solid rgba(255, 255, 255, 0.12)'
                : '1px solid rgba(0, 0, 0, 0.12)',
            },
          },
          text: {
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              '&:hover fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              },
            },
          },
        },
      },
      MuiChip: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            borderRadius: 3,
            fontWeight: 500,
            borderWidth: '1px',
            '&.MuiChip-colorPrimary': {
              borderColor: isDark ? 'rgba(25, 118, 210, 0.5)' : 'rgba(25, 118, 210, 0.5)',
              color: isDark ? '#42a5f5' : '#1976d2',
              backgroundColor: isDark ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)',
            },
            '&.MuiChip-colorSecondary': {
              borderColor: isDark ? 'rgba(220, 0, 78, 0.5)' : 'rgba(220, 0, 78, 0.5)',
              color: isDark ? '#ff5983' : '#dc004e',
              backgroundColor: isDark ? 'rgba(220, 0, 78, 0.1)' : 'rgba(220, 0, 78, 0.05)',
            },
            '&.MuiChip-colorSuccess': {
              borderColor: isDark ? 'rgba(46, 125, 50, 0.5)' : 'rgba(46, 125, 50, 0.5)',
              color: isDark ? '#4caf50' : '#2e7d32',
              backgroundColor: isDark ? 'rgba(46, 125, 50, 0.1)' : 'rgba(46, 125, 50, 0.05)',
            },
            '&.MuiChip-colorError': {
              borderColor: isDark ? 'rgba(211, 47, 47, 0.5)' : 'rgba(211, 47, 47, 0.5)',
              color: isDark ? '#ef5350' : '#d32f2f',
              backgroundColor: isDark ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)',
            },
            '&.MuiChip-colorWarning': {
              borderColor: isDark ? 'rgba(237, 108, 2, 0.5)' : 'rgba(237, 108, 2, 0.5)',
              color: isDark ? '#ff9800' : '#ed6c02',
              backgroundColor: isDark ? 'rgba(237, 108, 2, 0.1)' : 'rgba(237, 108, 2, 0.05)',
            },
            '&.MuiChip-colorInfo': {
              borderColor: isDark ? 'rgba(2, 136, 209, 0.5)' : 'rgba(2, 136, 209, 0.5)',
              color: isDark ? '#03a9f4' : '#0288d1',
              backgroundColor: isDark ? 'rgba(2, 136, 209, 0.1)' : 'rgba(2, 136, 209, 0.05)',
            },
            '&.MuiChip-colorDefault': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              backgroundColor: 'transparent',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
            borderBottom: isDark
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            margin: '0px',
            '&.Mui-selected': {
              backgroundColor: isDark ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.1)',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.15)',
              },
            },
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
    },
  });
};
