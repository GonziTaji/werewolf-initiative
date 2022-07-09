import { useRouter } from 'next/router';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import CharacterFormContainer from '../components/CharacterFormContainer';
import PageHeader from '../components/PageHeader';
import RoundInfo from '../components/RoundInfo';
import TurnList from '../components/TurnList';
import { useTurns } from '../hooks/useTurns';

export default function Home() {
    const router = useRouter();
    const { dispatchTurns, turnIndex, roundIndex } = useTurns();

    return (
        <>
            <div className="m-auto max-w-4xl">
                <PageHeader title="Encuentro">
                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns: '1fr auto 1fr',
                        }}
                    >
                        <button
                            className="text-left"
                            onClick={() => router.push('/')}
                        >
                            <FaCaretLeft className="inline" />
                            Atrás
                            <small className="block px-2">Menú principal</small>
                        </button>

                        <div className="text-center border-x px-2 border-black/25">
                            <span className="block">
                                Turno: {turnIndex + 1}
                            </span>
                            <span>Ronda: {roundIndex + 1}</span>
                        </div>

                        <button
                            onClick={finalizarEncuentro}
                            className="text-right"
                        >
                            Terminar
                            <FaCaretRight className="inline" />
                            <small className="block px-2">
                                Finalizar encuentro
                            </small>
                        </button>
                    </div>
                </PageHeader>

                <CharacterFormContainer />

                <TurnList />
            </div>
        </>
    );

    function finalizarEncuentro() {
        const response = confirm(`
            ¿Desea terminar el encuentro?
            \n\nEsta acción es irreversible
        `);

        if (response) {
            router.push('/').then(() => dispatchTurns({ type: 'limpiar' }));
        }
    }
}
