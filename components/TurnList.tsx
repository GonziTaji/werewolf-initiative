import { useMemo } from 'react';
import { useTurns } from '../hooks/useTurns';
import TurnElement from './TurnElement';

export default function TurnList() {
    const { turns } = useTurns();

    const sortedTurnElements = useMemo(() => {
        return [...turns]
            .sort((a, b) => (a.initiative < b.initiative ? 1 : -1))
            .map((turn, i) => <TurnElement turn={turn} key={i} />);
    }, [turns]);

    return <div className="flex flex-col gap-y-1">{sortedTurnElements}</div>;
}
