import React, { MouseEventHandler } from 'react';
import { Turn } from '../interfaces';
import { TurnState } from '../types';

export default function TurnElement(props: {
    turn: Turn;
    useSavedTurn: MouseEventHandler;
    holdTurn: MouseEventHandler;
    finishTurn: MouseEventHandler;
    removeTurn: MouseEventHandler;
    incapacitate: MouseEventHandler;
    capacitate: MouseEventHandler;
}) {
    const turn = props.turn;

    const turnStateColorClass = (() => {
        if (turn.incapacitated) {
            return 'danger'
        }

        switch (turn.turnState) {
            case TurnState.ACTING:
                return 'success';

            case TurnState.HOLD:
                return 'primary';

            case TurnState.WAITING:
                return 'warning';

            default:
                return 'danger'
        }
    })();

    const buttons = {
        capacitar:
            <button className="btn btn-sm btn-success" onClick={props.capacitate}>
                Recapacitar
            </button>,
        terminarTurno:
            <button className="btn btn-sm btn-primary" onClick={props.finishTurn}>
                Siguiente turno
            </button>,
        guardarTurno:
            <button
                style={{ marginLeft: 10 }}
                className="btn btn-sm btn-secondary"
                onClick={props.holdTurn}
            >
                Guardar
            </button>,
        usarTurno:
            <button
                className="btn btn-sm btn-primary"
                onClick={props.useSavedTurn}
            >
                Actuar
            </button>
    }

    const buttonsToRender: JSX.Element[] = []
    switch (turn.turnState) {
        case TurnState.ACTING:
            buttonsToRender.push(buttons.terminarTurno);

            if (turn.incapacitated) {
                buttonsToRender.push(buttons.capacitar);
            } else {
                buttonsToRender.push(buttons.guardarTurno)
            }
            break;

        case TurnState.HOLD:
            buttonsToRender.push(buttons.usarTurno);
            break;
    }

    return (
        <div className={'alert alert-'+turnStateColorClass}>
            <div className='row'>
                <div className='col'>
                    <span>
                        {turn.initiative}. {turn.characterName.toUpperCase()} &nbsp;
                        { turn.actions > 1 && `(Actúa x${turn.actions})`}
                    </span>
                </div>
                <div className='col col-auto'>
                    <div className={'badge bg-'+turnStateColorClass}>
                        {turn.turnState}
                    </div>
                </div>
            </div>
            <p>
            </p>

            <div className="row">
                { buttonsToRender.map(button => (
                    <div className='col col-auto p-1'>
                        {button}
                    </div>
                )) }

                {/* { (!TurnState.ACTING) && */}
                    <div className='col col-auto p-1'>
                        <button
                            style={{ marginLeft: 10 }}
                            className="btn btn-sm btn-danger"
                            onClick={props.incapacitate}
                            disabled={turn.incapacitated}
                        >
                            { turn.incapacitated ? 'Incapacitado' : 'Incapacitar' }
                        </button>
                    </div>
                {/* } */}
            </div>
        </div>
    );
}
