import { useTurns } from '../hooks/useTurns';

export default function StartButton() {
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
            onClick={() => dispatchTurns({ type: 'comenzar' })}
        >
            Comenzar
        </button>
    );
}
