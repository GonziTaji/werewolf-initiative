import TurnListContextProvider from '../components/TurnListContextProvider';
import '../styles/globals.css';
//---Juan
import { ThemeProvider } from '@mui/material';
import { theme } from '../utils';

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <TurnListContextProvider>
                <Component {...pageProps} />
            </TurnListContextProvider>
        </ThemeProvider>
    );
}

export default MyApp;
