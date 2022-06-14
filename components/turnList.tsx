import { useEffect, useState } from 'react';
import { PartialTurn, Turn } from '../interfaces';
import { TurnState } from '../types';
import CharacterForm from './CharacterForm';
import TurnElement from './TurnElement';

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
            const newTurns = [...turns];
            newTurns[turnIndex].turnState = TurnState.ACTING;
            newTurns[turnIndex].actionsUsed = 0;
            setTurns(newTurns);
        }
    }, [turnIndex]);

    useEffect(() => {
        if (turnIndex === -1) {
            setRoundIndex(roundIndex + 1);
        }
    }, [turnIndex]);

    return (
        <div className="px-1 m-auto max-w-4xl">
            <CharacterForm submitForm={addTurn}></CharacterForm>

            <div className="flex justify-between content-center items-center">
                <h2>Turnos</h2>

                {!roundsStarted && (
                    <button
                        disabled={!turns.length}
                        onClick={() => setTurnIndex(0)}
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

            <button onClick={getNextInitiative}>next</button>
            <button onClick={getPreviousInitiative}>previous</button>
        </div>
    );

    function getNextInitiative() {}

    function getPreviousInitiative() {}

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

    function addTurn(newTurn: Turn) {
        newTurn.id = Date.now().toString();

        if (turnIndex === -1) {
            setTurns(orderByInitiative([newTurn, ...turns]));
        } else {
            const newTurns = [...turns];

            for (let i = 0; i < newTurns.length; i++) {
                if (newTurns[i].initiative > newTurn.initiative) {
                    newTurns.splice(i, 0, newTurn);
                    setTurnIndex((turnIndex) => turnIndex + 1);
                    break;
                } else if (i === newTurns.length - 1) {
                    newTurns.push(newTurn);
                    break;
                }
            }

            setTurns(newTurns);
        }
    }

    function orderByInitiative(input: Turn[]) {
        return input.sort((a, b) => (a.initiative < b.initiative ? 1 : -1));
    }
}
