import TurnListContextProvider from '../components/TurnListContextProvider';
import TurnSetup from '../components/TurnSetup/TurnSetup';
import Wizard from '../components/wizard/Wizard';

export default function Home() {
    return (
        <TurnSetup />
        // <TurnListContextProvider>
        //     <Wizard />
        // </TurnListContextProvider>
    );
}
