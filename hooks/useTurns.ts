import { useContext } from 'react';
import { TurnListContext } from '../components/TurnListContextProvider';

export function useTurns() {
    const context = useContext(TurnListContext);

    return context;
}
