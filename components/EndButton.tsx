import { useTurns } from '../hooks/useTurns';

export default function EndButton() {
    const { turns, dispatchTurns } = useTurns();

    return (
        <button
            className={`
                font-bold
                bg-rose-700
                text-white
                disabled:bg-rose-300
                disabled:cursor-not-allowed
                cursor-pointer
                px-2 py-1
                rounded
            `}
            disabled={!turns.length}
            onClick={endEncounter}
        >
            Terminar
        </button>
    );

    function endEncounter() {
        const message =
            '¿Está seguro de terminar el encuentro?' +
            '\n\nEsto eliminará toda la información sobre los turnos actuales.';
        const response = confirm(message);

        if (response) {
            dispatchTurns({ type: 'limpiar' });
        }
    }
}
