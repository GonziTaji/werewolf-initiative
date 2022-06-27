import { useEffect, useState } from 'react';
import { useTurns } from '../hooks/useTurns';
import CharacterForm from './CharacterForm';
import Collapsable from './Collapsable';

export default function CharacterFormContainer() {
    const { roundIndex } = useTurns();
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (roundIndex === 0) {
            setShow(false);
        } else if (roundIndex === -1) {
            setShow(true);
        }
    }, [roundIndex]);

    return (
        <>
            <div className="mt-2 px-4 pb-0">
                <div className="flex justify-between content-center">
                    <h2 className="col-span-2 text-xl">Ingreso de personaje</h2>

                    <button
                        className="underline text-cyan-600"
                        type="button"
                        onClick={() => setShow(!show)}
                    >
                        {show ? 'Esconder' : 'Mostrar'}
                    </button>
                </div>

                <Collapsable className={show ? 'mt-3' : ''} collapsed={!show}>
                    <CharacterForm />
                </Collapsable>
            </div>

            <hr className="h-1 my-2 bg-rose-800" />
        </>
    );
}
