import TurnListContextProvider from '../components/TurnListContextProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <TurnListContextProvider>
            <Component {...pageProps} />
        </TurnListContextProvider>
    );
}

export default MyApp;
