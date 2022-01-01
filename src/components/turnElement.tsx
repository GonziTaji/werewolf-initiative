import React, { CSSProperties, MouseEventHandler, useRef } from 'react';
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

    const buttonStyles: CSSProperties = {
        // padding: '0.1rem',
        borderRadius: 'unset',
        borderColor: 'black',
    }

    const buttons = {
        capacitar:
            <button
                className="btn btn-sm btn-success"
                style={buttonStyles}
                onClick={props.capacitate}
            >
                Recapacitar
            </button>,
        terminarTurno:
            <button
                className="btn btn-sm btn-primary"
                style={buttonStyles}
                onClick={props.finishTurn}
            >
                Siguiente turno
            </button>,
        guardarTurno:
            <button
                className="btn btn-sm btn-secondary"
                style={buttonStyles}
                onClick={props.holdTurn}
            >
                Guardar
            </button>,
        usarTurno:
            <button
                className="btn btn-sm btn-primary"
                style={buttonStyles}
                onClick={props.useSavedTurn}
            >
                Actuar
            </button>,
        incapacitar:
            <button
                className="btn btn-sm btn-danger"
                style={buttonStyles}
                onClick={props.incapacitate}
                disabled={turn.incapacitated}
            >
                { turn.incapacitated ? 'Incapacitado' : 'Incapacitar' }
            </button>,
        usarRabia:
        <button
            className="btn btn-sm btn-primary"
            style={buttonStyles}
            onClick={props.useSavedTurn}
        >
            Actuar
        </button>,
    }

    const buttonsToRender: JSX.Element[] = []
    switch (turn.turnState) {
        case TurnState.ACTING:
            buttonsToRender.push(buttons.terminarTurno);

            if (!turn.incapacitated) {
                buttonsToRender.push(buttons.guardarTurno)
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
        <div className={'p-1 alert alert-'+turnStateColorClass}>
            <div className='row g-0'>
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

            <div className="row g-0">
                { buttonsToRender.map((button, i) => (
                    <div key={i} className='col col-auto p-0'>
                        {button}
                    </div>
                )) }
            </div>
        </div>
    );
}
