import { useEffect } from 'react';
import { useRef, useState } from 'react';
import { FaSkull } from 'react-icons/fa';
import { useTurns } from '../hooks/useTurns';
import { Turn } from '../interfaces';
import { TurnAction } from '../reducers/turnListReducer';
import { TurnState } from '../types';

interface TurnElementProps {
    turn: Turn;
}

export default function TurnElement({ turn }: TurnElementProps) {
    const { dispatchTurns } = useTurns();

    let containerBg = '';

    switch (turn.turnState) {
        case TurnState.ACTING:
            containerBg = turn.incapacitated ? 'bg-red-400' : 'bg-blue-300';
            break;

        default:
            containerBg = turn.incapacitated ? 'bg-pink-100' : 'bg-blue-100';
            break;
    }

    const dispatchTurnAction = (action: TurnAction) =>
        dispatchTurns({
            type: 'modificar',
            turnAction: action,
            turnId: turn.id,
        });

    const buttonProps: {
        [k: string]: {
            className: string;
            onClick: () => void;
            label: string;
            hidden?: boolean;
            disabled?: boolean;
        };
    } = {
        actuar: {
            className: 'text-white bg-emerald-800 hover:bg-emerald-700',
            onClick: () => dispatchTurnAction('actuar'),
            label: 'Actuar',
            disabled: turn.turnState !== TurnState.ACTING,
        },
        usarRabia: {
            className: 'text-white bg-red-400 hover:bg-red-300',
            onClick: () => dispatchTurnAction('rabia'),
            label: 'Rabia',
            disabled: turn.incapacitated,
        },
        guardarTurno: {
            className: 'text-stone-700 bg-orange-200 hover:bg-orange-300',
            onClick: () => dispatchTurnAction('guardar'),
            label: 'Guardar',
            disabled:
                !turn.isOwnTurn ||
                turn.turnState !== TurnState.ACTING ||
                turn.incapacitated,
            hidden: turn.turnState === TurnState.HOLD,
        },
        usarTurno: {
            className: 'text-stone-700 bg-orange-200 hover:bg-orange-300',
            onClick: () => dispatchTurnAction('usarTurno'),
            label: 'Usar turno',
            hidden: turn.turnState !== TurnState.HOLD || turn.incapacitated,
        },
        capacitar: {
            className: 'bg-red-100 text-rose-800 hover:bg-red-200',
            onClick: () => dispatchTurnAction('capacitar'),
            label: 'Capacitar',
            hidden: turn.incapacitated === false,
        },
        incapacitar: {
            className: 'text-red-100 bg-rose-800 hover:bg-rose-700',
            onClick: () => dispatchTurnAction('incapacitar'),
            label: 'Incapacitar',
            hidden: turn.incapacitated === true,
        },
    };

    return (
        <div className={containerBg + ' p-1 border border-black'}>
            <div className="grid grid-rows-a-2">
                <div
                    className={
                        'grid grid-cols-[auto_1fr_auto_auto] space-x-2 pb-1' +
                        (turn.isOwnTurn ? '  font-bold' : '')
                    }
                >
                    <span className="px-2">{turn.initiative}</span>

                    <span className="grow px-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {turn.characterName.toUpperCase()}
                    </span>

                    <span className="px-2">
                        {turn.actionsRemaining}/{turn.actions}
                    </span>

                    <button
                        hidden={!turn.incapacitated}
                        onClick={() => deleteTurn(turn)}
                        className="px-2 border-black/25 border rounded-xl bg-rose-700/40"
                    >
                        <FaSkull className="h-full text-black/75" />
                    </button>
                </div>

                <div className="grid grid-cols-4">
                    {Object.values(buttonProps)
                        .filter((p) => !p.hidden)
                        .map((props, i) => (
                            <ActionButton key={i} {...props}>
                                <span className="text-xs">
                                    {props.label.toUpperCase()}
                                </span>
                            </ActionButton>
                        ))}
                </div>
            </div>
        </div>
    );

    function deleteTurn(turn: Turn) {
        const message = `¿Matar a ${turn.characterName.toUpperCase()}?`;
        const response = confirm(message);

        if (!response) return;

        dispatchTurns({
            type: 'modificar',
            turnId: turn.id,
            turnAction: 'eliminar',
        });
    }
}

function ActionButton({
    className = undefined,
    hidden = undefined,
    children,
    ...props
}) {
    const displayClass = hidden ? 'hidden' : '';

    return (
        <button
            {...props}
            className={`${displayClass} ${className}
                disabled:bg-gray-100
                disabled:text-gray-400
                disabled:cursor-not-allowed
                transition-colors
                cursor-pointer
                font-bold
                border border-emerald-900
                border-r-0
                last:border-r`}
        >
            {children}
        </button>
    );
}
