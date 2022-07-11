import { createContext, useEffect, useReducer } from 'react';
import turnListReducer, {
    localStorageTurnDataKey,
    newTurnsState,
    TurnListStateContextValue,
} from '../reducers/turnListReducer';

export const TurnListContext = createContext<TurnListStateContextValue>(
    {} as any
);

export default function TurnListContextProvider({ children }) {
    const [{ turns, turnIndex, roundIndex, lastInitiative }, dispatchTurns] =
        useReducer(turnListReducer, newTurnsState());

    useEffect(() => {
        const localStorageTurnData = localStorage.getItem(
            localStorageTurnDataKey
        );

        if (localStorageTurnData) {
            dispatchTurns({
                type: 'init',
                contextState: JSON.parse(localStorageTurnData),
            });
        }
    }, []);

    return (
        <TurnListContext.Provider
            value={{
                turns,
                turnIndex,
                roundIndex,
                lastInitiative,
                roundsStarted: roundIndex >= 0,
                dispatchTurns,
            }}
        >
            {children}
        </TurnListContext.Provider>
    );
}
