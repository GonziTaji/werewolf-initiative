import { useEffect, useState } from 'react';
import { FaCaretRight, FaCaretUp } from 'react-icons/fa';
import { useTurns } from '../hooks/useTurns';
import CharacterForm from './CharacterForm';
import Collapsable from './Collapsable';

export default function CharacterFormContainer() {
    const { turns } = useTurns();
    const [show, setShow] = useState(false);
    const [previousTurnsCount, setPreviousTurnsCount] = useState(turns.length);

    useEffect(() => {
        if (previousTurnsCount !== turns.length) {
            setShow(false);
            setPreviousTurnsCount(turns.length);
        }
    }, [turns, previousTurnsCount]);

    return (
        <div className="px-2">
            <div className="flex content-center">
                <button
                    className="text-cyan-600 grow"
                    type="button"
                    onClick={() => setShow(!show)}
                >
                    <h2 className="inline w-full text-xl">
                        Agregar personaje
                        <span className="pl-4 h-full">
                            <FaCaretRight
                                className={
                                    'transition h-full inline' +
                                    (show ? ' rotate-90' : '')
                                }
                            />
                        </span>
                    </h2>
                </button>
            </div>

            <Collapsable className={show ? 'mt-3' : ''} collapsed={!show}>
                {/* <CharacterForm /> */}
            </Collapsable>
        </div>
    );
}
