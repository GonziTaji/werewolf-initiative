import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import Collapsable from '../components/Collapsable';
import PageHeader from '../components/PageHeader';
import TurnFormModal from '../components/TurnFormModal';
import TurnList from '../components/TurnList';
import { useTurns } from '../hooks/useTurns';

export default function Home() {
    const router = useRouter();
    const { dispatchTurns, turnIndex, roundIndex } = useTurns();
    const [showHeader, setShowHeader] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);

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
                                <span>Turno: {turnIndex + 1} | </span>
                                <span>Ronda: {roundIndex + 1}</span>
                                <button
                                    onClick={() => setShowFormModal(true)}
                                    className="text-cyan-800 underline block"
                                >
                                    Agregar turno
                                </button>
                            </div>

                            <div className="text-right">
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
