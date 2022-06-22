import { useTurns } from '../hooks/useTurns';
import TurnElement from './TurnElement';

export default function TurnList() {
    const { turns } = useTurns();

    return (
        <div className="flex flex-col gap-y-2">
            {turns.map((item, i) => (
                <TurnElement key={i} turn={item} />
            ))}
        </div>
    );
}
