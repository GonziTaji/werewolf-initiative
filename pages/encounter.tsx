import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import Collapsable from '../components/Collapsable';
import PageHeader from '../components/PageHeader';
import TurnFormModal from '../components/TurnFormModal';
import TurnList from '../components/TurnList';
import { useTurns } from '../hooks/useTurns';

export default function Home() {
    const router = useRouter();
    const { dispatchTurns, roundIndex, turns, lastInitiative } = useTurns();
    const [showHeader, setShowHeader] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);

    const playing = useMemo(() => {
        return turns
            .filter((t) => t.initiative === lastInitiative)
            .map((t) => ({
                name: t.characterName,
                acting: !!t.actionsRemaining,
            }));
    }, [turns, lastInitiative]);

    // Feedback for the user. This way the user sees the menu collapsing
    // and can infer that it can be shown.
    useEffect(() => {
        setTimeout(() => {
            setShowHeader(false);
        }, 400);
    }, []);

    return (
        <>
            <div className="sticky top-0">
                <button
                    className="bg-white w-full text-xl text-center"
                    onClick={() => setShowHeader(!showHeader)}
                >
                    Encuentro
                    <FaCaretDown
                        className={
                            'duration-300 transition h-full inline' +
                            (showHeader ? ' -rotate-180' : '')
                        }
                    />
                </button>

                <Collapsable collapsed={!showHeader}>
                    <PageHeader title="">
                        <div className="flex justify-between">
                            <div>
                                <button
                                    onClick={() => setShowFormModal(true)}
                                    className="text-cyan-800 underline block"
                                >
                                    Agregar turno
                                </button>
                                <span>Ronda: {roundIndex + 1}</span>
                            </div>

                            <div>
                                <button
                                    className="text-cyan-800 underline block"
                                    onClick={() => router.push('/')}
                                >
                                    Menú principal
                                </button>

                                <button
                                    onClick={finalizarEncuentro}
                                    className="text-cyan-800 underline block"
                                >
                                    Finalizar encuentro
                                </button>
                            </div>
                        </div>
                        <span className="grid grid-cols-[auto_1fr]">
                            <span className="pr-2">Turno de:</span>
                            <span className="whitespace-nowrap overflow-auto">
                                {playing.map(({ name, acting }, i, a) => (
                                    <span
                                        className={`font-bold  ${
                                            acting ? '' : 'text-black/40'
                                        }`}
                                    >
                                        {name.toUpperCase()}
                                        {i !== a.length - 1 && ', '}
                                    </span>
                                ))}
                            </span>
                        </span>
                    </PageHeader>

                    <br />
                </Collapsable>
            </div>

            <TurnList />

            <TurnFormModal
                hide={() => setShowFormModal(false)}
                show={showFormModal}
            />
        </>
    );

    function finalizarEncuentro() {
        const response = confirm(
            '¿Desea terminar el encuentro?\n\nEsta acción es irreversible'
        );

        if (response) {
            router.push('/').then(() => dispatchTurns({ type: 'limpiar' }));
        }
    }
}
