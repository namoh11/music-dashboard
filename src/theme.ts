import { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  components: {
    MuiGrid:{},
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',  // Set AppBar background to black
          color: '#ffffff',            // Set AppBar text color to white
        },
      },
    },
  },
};
