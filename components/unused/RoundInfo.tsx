import { useTurns } from '../../hooks/useTurns';
import EndButton from './EndButton';

export default function RoundInfo() {
    const { turnIndex, roundIndex } = useTurns();

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
