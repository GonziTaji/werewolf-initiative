import { CSSProperties } from 'react';
import { PartialTurn, Turn } from '../interfaces';
import { TurnState } from '../types';

interface TurnElementProps {
    turn: Turn;
    setTurn: (turn: PartialTurn) => void;
}

export default function TurnElement({ turn, setTurn }: TurnElementProps) {
    let containerBg = '';

    const baseButtonClass = `
        disabled:bg-gray-100
        disabled:text-gray-800
        disabled:cursor-not-allowed
        transition-colors
        cursor-pointer
        w-28
        rounded-sm
        text-md
        font-slim`;

    if (turn.incapacitated) {
        containerBg += 'bg-rose-100';
    } else {
        switch (turn.turnState) {
            case TurnState.ACTING:
                containerBg += 'bg-blue-50';
                break;

            case TurnState.WAITING:
            case TurnState.HOLD:
                containerBg += 'bg-yellow-50';
                break;
        }
    }

    const actions = {
        usarRabia: {
            className:
                'justify-self-start text-white bg-red-400 hover:bg-red-300',
            action: () => setTurn({ turnState: TurnState.ACTING }),
            label: 'Usar rabia',
            hidden: turn.turnState !== TurnState.WAITING || turn.incapacitated,
        },
        terminarTurno: {
            className:
                'justify-self-start text-white bg-green-600 hover:bg-green-500',
            action: () => setTurn({ turnState: TurnState.WAITING }),
            label: 'Terminar',
            hidden: turn.turnState !== TurnState.ACTING,
        },
        guardarTurno: {
            className:
                'justify-self-center col-start-2 text-stone-700 bg-fuchsia-200 hover:bg-fuchsia-300',
            action: () => setTurn({ turnState: TurnState.HOLD }),
            label: 'Guardar',
            hidden: turn.turnState !== TurnState.ACTING || turn.incapacitated,
        },
        usarTurno: {
            className:
                'justify-self-center col-start-2 text-stone-700 bg-fuchsia-200 hover:bg-fuchsia-300',
            action: () => setTurn({ turnState: TurnState.ACTING }),
            label: 'Actuar',
            hidden: turn.turnState !== TurnState.HOLD || turn.incapacitated,
        },
        capacitar: {
            className:
                'justify-self-end col-start-3 text-red-100 bg-rose-800 hover:bg-rose-700',
            action: () => setTurn({ incapacitated: !turn.incapacitated }),
            label: turn.incapacitated ? 'Recapacitar' : 'Incapacitar',
            hidden: false,
        },
    };

    return (
        <div className={containerBg + ' p-2 '}>
            <span className="text-sm border px-2 w-20">{turn.turnState}</span>
            <span>
                {turn.initiative}. {turn.characterName.toUpperCase()}
                &nbsp;
                {turn.actions > 1 && `(Actúa x${turn.actions})`}
            </span>

            <div className="grid grid-cols-3 justify-items-stretch gap-1">
                {Object.values(actions).map((button, i) => (
                    <button
                        hidden={button.hidden || false}
                        onClick={button.action}
                        className={button.className + ' ' + baseButtonClass}
                        key={i}
                    >
                        {button.label.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
}
