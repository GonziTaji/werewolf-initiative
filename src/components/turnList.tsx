import { CSSProperties, useEffect, useState } from 'react';
import { PartialTurn, Turn } from '../interfaces';
import { TurnState } from '../types';
import { CharacterForm } from './characterForm';
import TurnElement from './turnElement';

const style: { [key: string]: CSSProperties } = {
    container: {},
    card: {
        marginTop: 20,
    },
};

export default function TurnList() {
    const [turns, setTurns] = useState<Turn[]>([]);
    const [turnIndex, setTurnIndex] = useState(-1);
    const [roundIndex, setRoundIndex] = useState(0);

    const roundsStarted = turnIndex !== -1;

    useEffect(() => {
        if (!roundsStarted) {
            return;
        }

        if (turns.every((turn) => turn.turnState !== TurnState.ACTING)) {
            setTurnIndex((prevIurnIndex) => {
                if (prevIurnIndex == turns.length - 1) {
                    return 0;
                }

                return prevIurnIndex + 1;
            });
        }
    }, [turns]);

    useEffect(() => {
        if (turns.length && turns) {
            if (turns[turnIndex].incapacitated) {
                console.log(
                    'setting turnIndex inside turnIndex-dependant hook'
                );
                setTurnIndex(turnIndex + 1);
            } else {
                console.log('changing turn to acting');
                const newTurns = [...turns];
                newTurns[turnIndex].turnState = TurnState.ACTING;
                newTurns[turnIndex].actionsUsed = 0;
                setTurns(newTurns);
            }
        }
    }, [turnIndex]);

    useEffect(() => {
        if (turnIndex === -1) {
            setRoundIndex(roundIndex + 1);
        }
    }, [turnIndex]);

    return (
        <div className="container" style={style.container}>
            <CharacterForm submitForm={addTurn}></CharacterForm>

            <div className="card" style={style.card}>
                <div className="card-header d-flex justify-content-between align-items-center">
                    Turnos
                    {!roundsStarted && (
                        <button
                            disabled={!turns.length}
                            onClick={() => setTurnIndex(0)}
                            className="btn btn-sm btn-link"
                        >
                            Comenzar
                        </button>
                    )}
                </div>

                <div className="card-body">
                    {turns.map((item, i) => (
                        <TurnElement
                            key={i}
                            turn={item}
                            setTurn={(turn) => modifyTurn(i, turn)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    function changeTurnState(index: number, newTurnState: TurnState) {
        modifyTurn(index, { turnState: newTurnState });
    }

    function modifyTurn(index: number, changes: PartialTurn) {
        const newTurns = [...turns];

        newTurns[index] = {
            ...newTurns[index],
            ...changes,
        };

        setTurns(newTurns);
    }

    function removeTurn(index: number) {
        const newTurns = [...turns];

        newTurns.splice(index, 1);

        setTurns(newTurns);
    }

    function addTurn(turn: Turn) {
        const newTurns = orderByInitiative([turn, ...turns]);

        setTurns(newTurns);
    }

    function orderByInitiative(input: Turn[]) {
        return input.sort((a, b) => (a.initiative < b.initiative ? 1 : -1));
    }
}
