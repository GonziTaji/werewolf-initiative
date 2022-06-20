import { useEffect, useReducer, useState } from 'react';
import { PartialTurn, Turn } from '../interfaces';
import { TurnState } from '../types';
import CharacterForm from './CharacterForm';
import Collapsable from './Collapsable';
import TurnElement from './TurnElement';

interface TurnListState {
    turns: Turn[];
    turnIndex: number;
    roundIndex: number;
}

function turnsReducer(
    turnState: TurnListState,
    action: { type: 'addTurn' | 'modifyTurn' | 'startTurns'; turn?: Turn }
) {
    switch (action.type) {
        case 'startTurns': {
            const newState = { ...turnState };
            newState.roundIndex = 0;
            newState.turnIndex = 0;
            newState.turns[0].turnState = TurnState.ACTING;
            return newState;
        }

        case 'modifyTurn': {
            const newState = {
                ...turnState,
                turns: turnState.turns.map((t) => {
                    if (t.id === action.turn.id) {
                        return { ...action.turn };
                    }

                    return { ...t };
                }),
            };

            const noActing = newState.turns.every(
                (turn) => turn.turnState !== TurnState.ACTING
            );

            if (noActing) {
                if (newState.turnIndex === newState.turns.length - 1) {
                    newState.turnIndex = 0;
                    newState.roundIndex += 1;
                } else {
                    newState.turnIndex += 1;
                }

                newState.turns[newState.turnIndex].turnState = TurnState.ACTING;
            }

            return newState;
        }

        case 'addTurn': {
            const newState = {
                ...turnState,
                turns: [...turnState.turns],
            };

            const newTurn = {
                ...action.turn,
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
            return newState;
        }
    }
}

export default function TurnList() {
    const [{ turns, turnIndex, roundIndex }, doTurnAction] = useReducer(
        turnsReducer,
        {
            turns: [],
            turnIndex: -1,
            roundIndex: -1,
        }
    );

    const roundsStarted = turnIndex !== -1;

    const [showCharacterForm, setShowCharacterForm] = useState(true);

    return (
        <div className="m-auto max-w-4xl">
            <div className="my-2 p-4 pb-0">
                <div className="flex justify-between content-center pb-3">
                    <h2 className="col-span-2 text-xl">Ingreso de personaje</h2>

                    <button
                        className="underline text-cyan-600"
                        type="button"
                        onClick={() => setShowCharacterForm(!showCharacterForm)}
                    >
                        {showCharacterForm ? 'Esconder' : 'Mostrar'}
                    </button>
                </div>

                <Collapsable collapsed={!showCharacterForm}>
                    <CharacterForm submitForm={addTurn}></CharacterForm>
                </Collapsable>
            </div>

            <hr className="h-1 my-2 bg-rose-800" />

            <div className="flex gap-12 content-center items-center">
                <h2>
                    Turnos {turnIndex}
                    <small className="block">Ronda {roundIndex + 1}</small>
                </h2>
                {!roundsStarted && (
                    <button
                        className={`
                            font-bold
                            bg-rose-700
                            text-white
                            disabled:bg-rose-300
                            disabled:cursor-not-allowed
                            cursor-pointer
                            px-2 py-1
                            rounded
                        `}
                        disabled={!turns.length}
                        onClick={() => doTurnAction({ type: 'startTurns' })}
                    >
                        Comenzar
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-y-2">
                {turns.map((item, i) => (
                    <TurnElement
                        key={i}
                        turn={item}
                        setTurn={(turn) => modifyTurn(i, turn)}
                    />
                ))}
            </div>
        </div>
    );

    function modifyTurn(index: number, changes: PartialTurn) {
        const turn = {
            ...turns[index],
            ...changes,
        };
        console.log('turnstate 2: ' + turn.turnState);

        doTurnAction({ type: 'modifyTurn', turn });
    }

    function addTurn(newTurn: Turn) {
        doTurnAction({ type: 'addTurn', turn: newTurn });
    }
}
