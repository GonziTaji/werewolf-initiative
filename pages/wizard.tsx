import TurnListContextProvider from '../components/TurnListContextProvider';
import Wizard from '../components/wizard/Wizard';

export default function Home() {
    return (
        <TurnListContextProvider>
            <Wizard />
        </TurnListContextProvider>
    );
}
