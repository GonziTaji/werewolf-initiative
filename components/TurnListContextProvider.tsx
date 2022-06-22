import { createContext, useReducer } from 'react';
import { Turn } from '../interfaces';
import { TurnState } from '../types';

export const TurnListContext = createContext<TurnListStateContextValue>(
    {} as any
);

export default function TurnListContextProvider({ children }) {
    const [{ turns, turnIndex, roundIndex }, dispatchTurns] = useReducer(
        turnListReducer,
        {
            turns: [],
            turnIndex: -1,
            roundIndex: -1,
        }
    );

    return (
        <TurnListContext.Provider
            value={{
                turns,
                turnIndex,
                roundIndex,
                roundsStarted: roundIndex >= 0,
                dispatchTurns,
            }}
        >
            {children}
        </TurnListContext.Provider>
    );
}

function turnListReducer(turnState: TurnsState, action: TurnsAction) {
    switch (action.type) {
        case 'comenzar': {
            const newState = { ...turnState };
            newState.roundIndex = 0;
            newState.turnIndex = 0;
            newState.turns[0].turnState = TurnState.ACTING;
            newState.turns[0].isOwnTurn = true;
            newState.turns[0].actionsRemaining = newState.turns[0].actions;
            return newState;
        }

        case 'modificar': {
            const newState = {
                ...turnState,
                turns: turnState.turns.map((t, i) => {
                    if (t.id === action.turnId) {
                        return doTurnAction(t, action.turnAction);
                    }

                    return { ...t };
                }),
            };

            const noActing = newState.turns.every(
                (turn) => turn.turnState !== TurnState.ACTING
            );

            if (noActing) {
                newState.turns.forEach((t) => {
                    t.isOwnTurn = false;
                    t.isSavedTurn = false;
                });

                if (newState.turnIndex === newState.turns.length - 1) {
                    newState.turnIndex = 0;
                    newState.roundIndex += 1;
                } else {
                    newState.turnIndex += 1;
                }

                newState.turns[newState.turnIndex].turnState = TurnState.ACTING;
                newState.turns[newState.turnIndex].isOwnTurn = true;
                newState.turns[newState.turnIndex].actionsRemaining +=
                    newState.turns[newState.turnIndex].actions;
            }

            return newState;
        }

        case 'agregar': {
            const newState = {
                ...turnState,
                turns: [...turnState.turns],
            };

            const newTurn = {
                ...action.turn,
                id: Date.now().toString(),
                actionsRemaining: 0,
            };

            if (turnState.turnIndex === -1) {
                newState.turns = [newTurn, ...newState.turns].sort((a, b) =>
                    a.initiative < b.initiative ? 1 : -1
                );
            } else {
                const newTurns = [...newState.turns];

                for (let i = 0; i < newTurns.length; i++) {
                    if (newTurns[i].initiative < newTurn.initiative) {
                        newTurns.splice(i, 0, newTurn);
                        newState.turnIndex += 1;
                        break;
                    } else if (i === newTurns.length - 1) {
                        newTurns.push(newTurn);
                        break;
                    }
                }

                newState.turns = newTurns;
            }
            return newState;
        }
    }
}

function doTurnAction(turn: Turn, action: TurnAction) {
    const newTurn = { ...turn };

    switch (action) {
        case 'actuar':
            newTurn.actionsRemaining--;

            if (newTurn.actionsRemaining == 0) {
                newTurn.turnState = TurnState.WAITING;
                newTurn.isSavedTurn = false;
            }

            break;

        case 'rabia':
            newTurn.actionsRemaining++;

            if (newTurn.turnState === TurnState.WAITING) {
                newTurn.turnState = TurnState.ACTING;
            }

            break;

        case 'guardar':
            newTurn.turnState = TurnState.HOLD;
            break;

        case 'usarTurno':
            newTurn.turnState = TurnState.ACTING;
            newTurn.isSavedTurn = true;
            break;

        case 'incapacitar':
            newTurn.incapacitated = true;

            if (!newTurn.isOwnTurn) {
                newTurn.actionsRemaining = 0;
                newTurn.turnState = TurnState.WAITING;
                newTurn.isSavedTurn = false;
            }

            break;

        case 'capacitar':
            newTurn.incapacitated = false;
            break;
    }

    return newTurn;
}

export interface TurnListStateContextValue extends TurnsState {
    dispatchTurns: (action: TurnsAction) => void;
    roundsStarted: boolean;
}

export interface TurnsState {
    turns: Turn[];
    turnIndex: number;
    roundIndex: number;
}

interface TurnsAction {
    type: TurnsActionType;
    turn?: Turn;
    turnAction?: TurnAction;
    turnId?: string;
}

type TurnsActionType = 'agregar' | 'comenzar' | 'modificar';

export type TurnAction =
    | 'actuar'
    | 'rabia'
    | 'guardar'
    | 'usarTurno'
    | 'incapacitar'
    | 'capacitar';
