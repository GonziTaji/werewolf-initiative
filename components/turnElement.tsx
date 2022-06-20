import { CSSProperties } from 'react';
import { PartialTurn, Turn } from '../interfaces';
import { TurnState } from '../types';

interface TurnElementProps {
    turn: Turn;
    setTurn: (turn: PartialTurn) => void;
}

export default function TurnElement({ turn, setTurn }: TurnElementProps) {
    let containerBg = '';

    switch (turn.turnState) {
        case TurnState.ACTING:
            containerBg = turn.incapacitated ? 'bg-rose-800' : 'bg-blue-300';
            break;

        default:
            containerBg = turn.incapacitated ? 'bg-rose-100' : 'bg-blue-100';
            break;
    }

    const actions: {
        [k: string]: {
            className: string;
            action: () => void;
            label: string;
            hidden?: boolean;
            disabled?: boolean;
        };
    } = {
        terminarTurno: {
            className: 'text-white bg-emerald-800 hover:bg-emerald-700',
            action: () => setTurn({ turnState: TurnState.WAITING }),
            label: 'Terminar',
            disabled: turn.turnState !== TurnState.ACTING,
        },
        usarRabia: {
            className: 'text-white bg-red-400 hover:bg-red-300',
            action: () => setTurn({ turnState: TurnState.HOLD }),
            label: 'Rabia',
            hidden: turn.turnState !== TurnState.WAITING,
            disabled: turn.incapacitated,
        },
        guardarTurno: {
            className: 'text-stone-700 bg-orange-200 hover:bg-orange-300',
            action: () => setTurn({ turnState: TurnState.HOLD }),
            label: 'Guardar',
            hidden: turn.turnState !== TurnState.ACTING,
            disabled: turn.incapacitated,
        },
        usarTurno: {
            className: 'text-white bg-emerald-800 hover:bg-emerald-700',
            action: () => setTurn({ turnState: TurnState.ACTING }),
            label: 'Actuar',
            hidden: turn.turnState !== TurnState.HOLD || turn.incapacitated,
        },
        capacitar: {
            className:
                '' +
                (turn.incapacitated
                    ? 'bg-red-100 text-rose-800 hover:bg-red-200'
                    : 'text-red-100 bg-rose-800 hover:bg-rose-700'),
            action: () => setTurn({ incapacitated: !turn.incapacitated }),
            label: turn.incapacitated ? 'Recapacitar' : 'Incapacitar',
            hidden: false,
        },
    };

    return (
        <div className={containerBg + ' p-3 shadow-lg'}>
            <div className="flex space-x-2 pb-1">
                <span className="bg-white px-2">{turn.initiative}</span>

                <span className="grow bg-white px-2">
                    {turn.characterName.toUpperCase()}
                </span>

                <span></span>
            </div>
            <div className="grid grid-flow-col auto-cols-fr">
                {Object.values(actions).map((button, i) => (
                    <button
                        hidden={button.hidden || false}
                        disabled={button.disabled || false}
                        onClick={button.action}
                        className={
                            button.className +
                            `
                                disabled:bg-gray-100
                                disabled:text-gray-400
                                disabled:cursor-not-allowed
                                transition-colors
                                cursor-pointer
                                py-1
                                text-sm
                                font-bold`
                        }
                        key={i}
                    >
                        {button.label.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
}
