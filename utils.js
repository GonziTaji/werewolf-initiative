import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#8a1c1c',
            background: '8a1c1c',
        },
        secondary: {
            main: '#2877c6',
        },
    },
    typography:{
      fontFamily: "eb garanmond, sans-serif",
    },
    // Override default component styles
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#373737',
                    color: '#a10000',
                },
            },
        },
    },
});
