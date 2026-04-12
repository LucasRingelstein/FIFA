import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565c0'
    },
    secondary: {
      main: '#2e7d32'
    },
    background: {
      default: '#f4f6f8'
    }
  },
  shape: {
    borderRadius: 12
  }
});
