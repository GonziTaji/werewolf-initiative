import { CSSProperties } from 'react';
import { PartialTurn, Turn } from '../interfaces';
import { TurnState } from '../types';

interface TurnElementProps {
    turn: Turn;
    setTurn: (turn: PartialTurn) => void;
}

export default function TurnElement({ turn, setTurn }: TurnElementProps) {
    const classNameByTurnState = (() => {
        if (turn.incapacitated) {
            return 'incapacitated';
        }

        return TurnState.ACTING.toLowerCase();
    })();

    const buttonStyles: CSSProperties = {
        width: '8rem',
    };

    const actions = {
        capacitar: {
            style: buttonStyles,
            action: () => setTurn({ incapacitated: !turn.incapacitated }),
            label: turn.incapacitated ? 'Recapacitar' : 'Incapacitar',
        },
        terminarTurno: {
            style: buttonStyles,
            action: () => setTurn({ turnState: TurnState.WAITING }),
            label: 'Terminar',
        },
        guardarTurno: {
            style: buttonStyles,
            action: () => setTurn({ turnState: TurnState.HOLD }),
            label: 'Guardar',
        },
        usarTurno: {
            style: buttonStyles,
            action: () => setTurn({ turnState: TurnState.ACTING }),
            label: 'Actuar',
        },
        usarRabia: {
            style: buttonStyles,
            action: () => setTurn({ turnState: TurnState.ACTING }),
            label: 'Usar rabia',
        },
    };

    const buttonsToRender: any[] = [];
    switch (turn.turnState) {
        case TurnState.ACTING:
            buttonsToRender.push(actions.terminarTurno);

            if (!turn.incapacitated) {
                buttonsToRender.push(actions.guardarTurno);
            }
            break;

        case TurnState.HOLD:
            buttonsToRender.push(actions.usarTurno);
            break;
        case TurnState.WAITING:
            !turn.incapacitated && buttonsToRender.push(actions.usarRabia);
            break;
    }

    buttonsToRender.push(actions.capacitar);

    return (
        <div>
            <span>
                {turn.initiative}. {turn.characterName.toUpperCase()}
                &nbsp;
                {turn.actions > 1 && `(Actúa x${turn.actions})`}
            </span>

            <div>{turn.turnState}</div>

            {buttonsToRender.map((button, i) => (
                <button
                    onClick={button.action}
                    style={button.style}
                    key={i}
                    disabled={button.disabled}
                >
                    {button.label}
                </button>
            ))}
        </div>
    );
}
