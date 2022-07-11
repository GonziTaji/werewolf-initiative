import { Turn } from '../interfaces';
import { TurnState } from '../types';

export const localStorageTurnDataKey = 'turns-data';

/**
 *
 * @param fromLocalStorage use turnsState on localStorage if exists. default `false`
 * @returns
 */
export function newTurnsState(fromLocalStorage = false): TurnsState {
    if (fromLocalStorage) {
        const localStorageTurnData = localStorage.getItem(
            localStorageTurnDataKey
        );

        if (localStorageTurnData) {
            return JSON.parse(localStorageTurnData);
        }
    }

    return {
        turns: [],
        turnIndex: -1,
        roundIndex: -1,
        lastInitiative: 0,
    };
}

export default function turnListReducer(
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
            };
            break;
        }

        case 'limpiar': {
            newState = newTurnsState();

            break;
        }

        case 'comenzar': {
            const maxInitiative = getMaxInitiative(action.turns);

            const newTurns = [...action.turns].map((turn) => {
                turn.id = newTurnId();

                if (turn.initiative === maxInitiative) {
                    turn.turnState = TurnState.ACTING;
                    turn.isOwnTurn = true;
                    turn.actionsRemaining += turn.actions;
                }

                return turn;
            });

            newState = {
                ...turnState,
                roundIndex: 0,
                turnIndex: 0,
                turns: newTurns,
                lastInitiative: maxInitiative,
            };

            break;
        }

        case 'modificar': {
            newState = {
                ...turnState,
                turns: turnState.turns
                    .map((t) =>
                        t.id === action.turnId
                            ? doTurnAction(t, action.turnAction)
                            : { ...t }
                    )
                    .filter((t) => t),
            };

            const nobodyActing = newState.turns.every(
                (turn: Turn) => turn.turnState !== TurnState.ACTING
            );

            if (nobodyActing) {
                newState.lastInitiative = [...newState.turns]
                    .sort((a, b) => (a.initiative < b.initiative ? 1 : -1))
                    .find(
                        (t) => t.initiative < newState.lastInitiative
                    )?.initiative;

                if (newState.lastInitiative === undefined) {
                    newState.roundIndex++;
                    newState.turnIndex = 0;

                    newState.lastInitiative = getMaxInitiative(newState.turns);
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
            newState = {
                ...turnState,
                turns: [
                    ...turnState.turns,
                    ...action.turns.map((t) => ({ ...t, id: newTurnId() })),
                ],
            };

            break;
        }
    }

    localStorage.setItem(localStorageTurnDataKey, JSON.stringify(newState));

    return newState;
}

function doTurnAction(turn: Turn, action: TurnAction) {
    const newTurn: Turn = { ...turn };

    switch (action) {
        case 'actuar':
            newTurn.actionsRemaining--;

            if (newTurn.actionsRemaining == 0) {
                newTurn.turnState = TurnState.WAITING;
                newTurn.isSavedTurn = false;
            }

            return newTurn;

        case 'rabia':
            newTurn.actionsRemaining++;

            if (newTurn.turnState === TurnState.WAITING) {
                newTurn.turnState = TurnState.ACTING;
            }

            return newTurn;

        case 'guardar':
            newTurn.turnState = TurnState.HOLD;
            return newTurn;

        case 'usarTurno':
            newTurn.turnState = TurnState.ACTING;
            newTurn.isSavedTurn = true;
            return newTurn;

        case 'incapacitar':
            newTurn.incapacitated = true;

            if (!newTurn.isOwnTurn) {
                newTurn.actionsRemaining = 0;
                newTurn.turnState = TurnState.WAITING;
                newTurn.isSavedTurn = false;
            }

            return newTurn;

        case 'capacitar':
            newTurn.incapacitated = false;
            return newTurn;

        case 'eliminar':
            return null;
    }
}

function newTurnId() {
    return Math.random().toFixed(20).split('.')[1];
}

function getMaxInitiative(turns: Turn[]) {
    return Math.max(...turns.map((t) => t.initiative));
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
    | 'capacitar'
    | 'eliminar';
