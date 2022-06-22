import CharacterFormContainer from '../components/CharacterFormContainer';
import RoundInfo from '../components/RoundInfo';
import TurnList from '../components/TurnList';
import TurnListContextProvider from '../components/TurnListContextProvider';

export default function Home() {
    return (
        <>
            <TurnListContextProvider>
                <div className="m-auto max-w-4xl">
                    <CharacterFormContainer />
                    <RoundInfo />
                    <TurnList />
                </div>
            </TurnListContextProvider>
        </>
    );
}
