import { useTurns } from '../hooks/useTurns';
import StartButton from './StartButton';

export default function RoundInfo() {
    const { roundsStarted, turnIndex, roundIndex } = useTurns();

    if (!roundsStarted) {
        return <StartButton />;
    }

    return (
        <div className="flex gap-4">
            <span>Turno: {turnIndex + 1}</span>
            <span className="">Ronda: {roundIndex + 1}</span>
        </div>
    );
}
