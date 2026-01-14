import React from 'react';
import { SnackbarProvider } from 'notistack';
import { useThemeMode } from './ThemeContext';
export const ToastProvider = ({ children }) => {
  const { theme } = useThemeMode();
  const isDark = theme.palette.mode === 'dark';
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      dense
      preventDuplicate
      autoHideDuration={3000}
      style={{
        backgroundColor: isDark ? '#0c1017' : '#ffffff',
        color: isDark ? '#ffffff' : '#1a1a1a',
      }}
    >
      {children}
    </SnackbarProvider>
  );
};
