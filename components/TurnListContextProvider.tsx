import { createContext, useEffect, useReducer } from 'react';
import { Turn } from '../interfaces';
import { TurnState } from '../types';

export const TurnListContext = createContext<TurnListStateContextValue>(
    {} as any
);

const localStorageTurnDataKey = 'turns-data';

export default function TurnListContextProvider({ children }) {
    const [{ turns, turnIndex, roundIndex, lastInitiative }, dispatchTurns] =
        useReducer(turnListReducer, {
            turns: [],
            turnIndex: -1,
            roundIndex: -1,
            lastInitiative: 0,
        } as TurnsState);

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

function turnListReducer(
    turnState: TurnsState,
    action: TurnsAction
): TurnsState {
    let newState: any;

    switch (action.type) {
        case 'init': {
            newState = {
                turnIndex: 0,
                roundIndex: 0,
                lastInitiative: 0,
                ...action.contextState,
                turns: [...action.contextState.turns].sort((a, b) =>
                    a.initiative < b.initiative ? 1 : -1
                ),
            };
            break;
        }

        case 'limpiar': {
            newState = {
                turns: [],
                turnIndex: -1,
                roundIndex: -1,
            };

            break;
        }

        case 'comenzar': {
            newState = { ...turnState };

            newState.lastInitiative = Math.max(
                ...turnState.turns.map((t) => t.initiative)
            );

            newState.turns
                .filter((t: Turn) => t.initiative === newState.lastInitiative)
                .forEach((t: Turn) => {
                    t.turnState = TurnState.ACTING;
                    t.isOwnTurn = true;
                    t.actionsRemaining = t.actions;
                });

            newState.roundIndex = 0;
            newState.urnIndex = 0;

            break;
        }

        case 'modificar': {
            newState = {
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
                newState.lastInitiative =
                    [...newState.turns]
                        .sort((a, b) => (a.initiative < b.initiative ? 1 : -1))
                        .find((t) => t.initiative < newState.lastInitiative)
                        ?.initiative || 0;

                if (!newState.lastInitiative) {
                    newState.roundIndex++;
                    newState.turnIndex = 0;

                    newState.lastInitiative = Math.max(
                        ...newState.turns.map((t) => t.initiative)
                    );
                } else {
                    newState.turnIndex++;
                }

                newState.turns.forEach((t: Turn) => {
                    t.isOwnTurn = false;
                    t.isSavedTurn = false;

                    if (t.initiative === newState.lastInitiative) {
                        t.turnState = TurnState.ACTING;
                        t.isOwnTurn = true;
                        t.actionsRemaining = t.actions;
                    }
                });
            }

            break;
        }

        case 'agregar': {
            console.log('agregar called');
            newState = {
                ...turnState,
                turns: [...turnState.turns],
            };

            for (const turn of action.turns) {
                const newTurn = {
                    ...turn,
                    id: Date.now().toString(),
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
            }
            break;
        }
    }

    localStorage.setItem(localStorageTurnDataKey, JSON.stringify(newState));

    return newState;
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
    lastInitiative: number;
}

interface TurnsAction {
    type: TurnsActionType;
    turns?: Turn[];
    turnAction?: TurnAction;
    turnId?: string;
    contextState?: TurnsState;
}

type TurnsActionType =
    | 'agregar'
    | 'comenzar'
    | 'modificar'
    | 'init'
    | 'limpiar';

export type TurnAction =
    | 'actuar'
    | 'rabia'
    | 'guardar'
    | 'usarTurno'
    | 'incapacitar'
    | 'capacitar';
