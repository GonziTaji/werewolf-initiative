import { PartialTurn, Turn } from '../interfaces';
import { TurnState } from '../types';

interface TurnElementProps {
    turn: Turn;
    setTurn: (turn: PartialTurn) => void;
    turnsStarted: boolean;
}

type TurnAction =
    | 'actuar'
    | 'rabia'
    | 'guardar'
    | 'usarTurno'
    | 'incapacitar'
    | 'capacitar';

function turnReducer(state: Turn, action: { type: TurnAction; payload?: {} }) {
    const newTurn = { ...state };

    switch (action.type) {
        case 'actuar':
            newTurn.actionsRemaining--;

            if (newTurn.actionsRemaining == 0) {
                newTurn.turnState = TurnState.WAITING;
                newTurn.isSavedTurn = false;
            }

            break;

        case 'rabia':
            newTurn.actionsRemaining++;

            if (newTurn.turnState === TurnState.WAITING) {
                newTurn.turnState = TurnState.ACTING;
            }

            break;

        case 'guardar':
            newTurn.turnState = TurnState.HOLD;
            break;

        case 'usarTurno':
            newTurn.turnState = TurnState.ACTING;
            newTurn.isSavedTurn = true;
            break;

        case 'incapacitar':
            newTurn.incapacitated = true;

            if (!newTurn.isOwnTurn) {
                newTurn.actionsRemaining = 0;
                newTurn.turnState = TurnState.WAITING;
                newTurn.isSavedTurn = false;
            }

            break;

        case 'capacitar':
            newTurn.incapacitated = false;
            break;
    }

    return newTurn;
}

export default function TurnElement({
    turn,
    setTurn,
    turnsStarted,
}: TurnElementProps) {
    let containerBg = '';

    switch (turn.turnState) {
        case TurnState.ACTING:
            containerBg = turn.incapacitated ? 'bg-rose-800' : 'bg-blue-300';
            break;

        default:
            containerBg = turn.incapacitated ? 'bg-rose-100' : 'bg-blue-100';
            break;
    }

    // not using state as for now
    const dispatchTun = (action: TurnAction) =>
        setTurn(turnReducer(turn, { type: action }));

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
            onClick: () => dispatchTun('actuar'),
            label: 'Actuar',
            disabled: turn.turnState !== TurnState.ACTING,
        },
        usarRabia: {
            className: 'text-white bg-red-400 hover:bg-red-300',
            onClick: () => dispatchTun('rabia'),
            label: 'Rabia',
            disabled: turn.incapacitated,
        },
        guardarTurno: {
            className: 'text-stone-700 bg-orange-200 hover:bg-orange-300',
            onClick: () => dispatchTun('guardar'),
            label: 'Guardar',
            disabled:
                !turn.isOwnTurn ||
                turn.turnState !== TurnState.ACTING ||
                turn.incapacitated,
            hidden: turn.turnState === TurnState.HOLD,
        },
        usarTurno: {
            className: 'text-stone-700 bg-orange-200 hover:bg-orange-300',
            onClick: () => dispatchTun('usarTurno'),
            label: 'Usar turno',
            hidden: turn.turnState !== TurnState.HOLD || turn.incapacitated,
        },
        capacitar: {
            className: 'bg-red-100 text-rose-800 hover:bg-red-200',
            onClick: () => dispatchTun('capacitar'),
            label: 'Capacitar',
            hidden: turn.incapacitated === false,
        },
        incapacitar: {
            className: 'text-red-100 bg-rose-800 hover:bg-rose-700',
            onClick: () => dispatchTun('incapacitar'),
            label: 'Incapacitar',
            hidden: turn.incapacitated === true,
        },
    };

    return (
        <div className={containerBg + ' p-3 shadow-lg'}>
            <div className="grid grid-rows-2">
                <div className="flex space-x-2 pb-1">
                    <span
                        className={
                            'bg-white px-2' +
                            (turn.isOwnTurn ? ' font-bold' : '')
                        }
                    >
                        {turn.initiative}
                    </span>

                    <span className="grow bg-white px-2">
                        {turn.characterName.toUpperCase()}
                    </span>

                    <span className="bg-white px-2">
                        {turn.actionsRemaining}/{turn.actions}
                    </span>
                </div>

                <div className="grid grid-cols-4">
                    {Object.values(buttonProps).map((props, i) => (
                        <ActionButton
                            key={i}
                            {...props}
                            disabled={!turnsStarted || props.disabled}
                        >
                            <span className="text-xs">
                                {props.label.toUpperCase()}
                            </span>
                        </ActionButton>
                    ))}
                </div>
            </div>
        </div>
    );
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
                font-bold `}
        >
            {children}
        </button>
    );
}