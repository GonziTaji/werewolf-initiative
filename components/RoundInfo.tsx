import { useTurns } from '../hooks/useTurns';
import EndButton from './EndButton';
import StartButton from './StartButton';

export default function RoundInfo() {
    const { roundsStarted, turnIndex, roundIndex } = useTurns();

    if (!roundsStarted) {
        return <StartButton />;
    }

    return (
        <div className="flex gap-4 items-center">
            <span>Turno: {turnIndex + 1}</span>
            <span>Ronda: {roundIndex + 1}</span>
            <div className="grow text-right m-1">
                <EndButton />
            </div>
        </div>
    );
}
