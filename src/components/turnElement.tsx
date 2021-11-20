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
        switch (turn.turnState) {
            case TurnState.ACTING:
                return turn.incapacitated ? 'danger' : 'success';

            case TurnState.HOLD:
                return 'primary';

            case TurnState.WAITING:
                return 'warning';

            default:
                return 'danger'
        }
    })();

    const actionButtons = (() => {
        switch (turn.turnState) {
            case TurnState.ACTING:
                return turn.incapacitated ?
                <>
                    <button className="btn btn-sm btn-success" onClick={props.capacitate}>
                        Capacitar
                    </button>

                    <button className="btn btn-sm btn-primary" onClick={props.finishTurn}>
                        Siguiente turno
                    </button>
                </>
                :
                <>
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={props.finishTurn}
                    >
                        Terminar
                    </button>

                    <button
                        style={{ marginLeft: 10 }}
                        className="btn btn-sm btn-secondary"
                        onClick={props.holdTurn}
                    >
                        Guardar
                    </button>
                </>;

            case TurnState.HOLD:
                return (
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={props.useSavedTurn}
                    >
                        Actuar
                    </button>
                );
        }
    })();


    return (
        <div className={'alert alert-'+turnStateColorClass}>
            <p>
                {turn.initiative}. {turn.characterName.toUpperCase()} (Acciones: {turn.actions})
            </p>

            <div className="d-flex justify-content-between">
                <div className="col col-auto">
                    {actionButtons}

                    <button
                        style={{ marginLeft: 10 }}
                        className="btn btn-sm btn-danger"
                        onClick={props.incapacitate}
                        disabled={turn.incapacitated}
                    >
                        { turn.incapacitated ? 'Incapacitado' : 'Incapacitar' }
                    </button>
                </div>

                <div className="col col-auto">
                    <div className={'badge bg-'+turnStateColorClass}>
                        {turn.turnState}
                    </div>
                </div>
            </div>
        </div>
    );
}
