import { CSSProperties } from 'react';
import { PartialTurn, Turn } from '../interfaces';
import { TurnState } from '../types';

interface TurnElementProps {
    turn: Turn;
    setTurn: (turn: PartialTurn) => void;
}

export default function TurnElement({ turn, setTurn }: TurnElementProps) {
    const turnStateColorClass = (() => {
        if (turn.incapacitated) {
            return 'danger';
        }

        switch (turn.turnState) {
            case TurnState.ACTING:
                return 'success';

            case TurnState.HOLD:
                return 'primary';

            case TurnState.WAITING:
                return 'warning';

            default:
                return 'danger';
        }
    })();

    const buttonStyles: CSSProperties = {
        // padding: '0.1rem',
        borderRadius: 'unset',
        borderColor: 'black',
    };

    const buttons = {
        capacitar: (
            <button
                className="btn btn-sm btn-success"
                style={buttonStyles}
                onClick={() => setTurn({ incapacitated: false })}
            >
                Recapacitar
            </button>
        ),
        terminarTurno: (
            <button
                className="btn btn-sm btn-primary"
                style={buttonStyles}
                onClick={() => setTurn({ turnState: TurnState.WAITING })}
            >
                Siguiente turno
            </button>
        ),
        guardarTurno: (
            <button
                className="btn btn-sm btn-secondary"
                style={buttonStyles}
                onClick={() => setTurn({ turnState: TurnState.HOLD })}
            >
                Guardar
            </button>
        ),
        usarTurno: (
            <button
                className="btn btn-sm btn-primary"
                style={buttonStyles}
                onClick={() => setTurn({ turnState: TurnState.ACTING })}
            >
                Actuar
            </button>
        ),
        incapacitar: (
            <button
                className="btn btn-sm btn-danger"
                style={buttonStyles}
                onClick={() =>
                    setTurn({
                        turnState: TurnState.WAITING,
                        incapacitated: true,
                    })
                }
                disabled={turn.incapacitated}
            >
                {turn.incapacitated ? 'Incapacitado' : 'Incapacitar'}
            </button>
        ),
        usarRabia: (
            <button
                className="btn btn-sm btn-primary"
                style={buttonStyles}
                onClick={() => setTurn({ turnState: TurnState.ACTING })}
            >
                Actuar
            </button>
        ),
    };

    const buttonsToRender: JSX.Element[] = [];
    switch (turn.turnState) {
        case TurnState.ACTING:
            buttonsToRender.push(buttons.terminarTurno);

            if (!turn.incapacitated) {
                buttonsToRender.push(buttons.guardarTurno);
            }
            break;

        case TurnState.HOLD:
            buttonsToRender.push(buttons.usarTurno);
            break;
    }

    if (turn.incapacitated) {
        buttonsToRender.push(buttons.capacitar);
    } else {
        buttonsToRender.push(buttons.incapacitar);
    }

    return (
        <div className={'p-1 alert alert-' + turnStateColorClass}>
            <div className="row g-0">
                <div className="col">
                    <span>
                        {turn.initiative}. {turn.characterName.toUpperCase()}
                        &nbsp;
                        {turn.actions > 1 && `(Actúa x${turn.actions})`}
                    </span>
                </div>
                <div className="col col-auto">
                    <div className={'badge bg-' + turnStateColorClass}>
                        {turn.turnState}
                    </div>
                </div>
            </div>

            <div className="row g-0">
                {buttonsToRender.map((button, i) => (
                    <div key={i} className="col col-auto p-0">
                        {button}
                    </div>
                ))}
            </div>
        </div>
    );
}
