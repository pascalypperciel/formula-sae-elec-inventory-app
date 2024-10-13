import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#912338',
      contrastText: '#fff',
    },
    secondary: {
      main: '#e5a712',
      contrastText: '#fff',
    },
    success: {
      main: '#2e7d32',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 500 },
    h2: { fontSize: '1.75rem', fontWeight: 500 },
    body1: { fontSize: '1rem' },
    button: { textTransform: 'none' },
  },
});

export default theme;
