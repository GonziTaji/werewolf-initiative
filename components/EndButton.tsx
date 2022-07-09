import { useRouter } from 'next/router';
import { useTurns } from '../hooks/useTurns';

export default function EndButton() {
    const { turns, dispatchTurns } = useTurns();
    const router = useRouter();
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
            router.push('/').then(() => dispatchTurns({ type: 'limpiar' }));
        }
    }
}
