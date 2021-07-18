import React, { MouseEventHandler } from 'react';
import { Turn } from '../interfaces';
import { TurnState } from '../types';

export default function TurnElement(props: {
    turn: Turn;
    useSavedTurn: MouseEventHandler;
    holdTurn: MouseEventHandler;
    finishTurn: MouseEventHandler;
}) {
    const turn = props.turn;

    const turnStateColorClass = (() => {
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

    return (
        <div className="list-group">
            <div className="list-group-item d-flex align-items-center justify-content-between ">
                <span>
                    {turn.initiative < 10 && '0'}
                    {turn.initiative}. {turn.characterName.toUpperCase()}
                    <br />
                    <small className="ms-4">Acciones {turn.actions}</small>
                </span>

                <span>
                    {turn.turnState === TurnState.HOLD && (
                        <button
                            className="btn btn-primary btn-outline"
                            onClick={props.useSavedTurn}
                        >
                            Actuar
                        </button>
                    )}

                    {turn.turnState === TurnState.ACTING && (
                        <button
                            className="btn btn-success btn-outline"
                            onClick={props.holdTurn}
                        >
                            Guardar Turno
                        </button>
                    )}

                    {turn.turnState === TurnState.ACTING && (
                        <button
                            className="btn btn-primary btn-outline"
                            onClick={props.finishTurn}
                        >
                            Terminar Turno
                        </button>
                    )}

                    <div className={'badge bg-'+turnStateColorClass}>
                        {turn.turnState}
                    </div>
                </span>
            </div>
        </div>
    );
}
