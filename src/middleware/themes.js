import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

export const muiTheme = createTheme({
    typography: {
        allVariants: {
            fontSize: '14.4px',
            letterSpacing: "-0.01rem"
        },
    },
});