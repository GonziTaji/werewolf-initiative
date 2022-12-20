import { useMemo, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useTurns } from '../hooks/useTurns';
import { Turn } from '../interfaces';
import { TurnState } from '../types';
import CharacterForm, { formDataInitialState } from './CharacterForm';

interface TurnFormModalProps {
    show: boolean;
    hide: () => void;
}

export default function TurnFormModal({ show, hide }: TurnFormModalProps) {
    const [formData, setFormData] = useState(formDataInitialState());
    const { dispatchTurns } = useTurns();

    const errors = useMemo(() => {
        const newErrors = [];

        for (const key in formData) {
            if (!formData[key].isValid) {
                if (formData[key].errorMsg) {
                    newErrors.push(formData[key].errorMsg);
                } else {
                    newErrors.push(`Campo inválido: ${formData[key].label}`);
                }
            }
        }

        return newErrors;
    }, [formData]);

    return (
        <>
            <div
                className={
                    'transition-all duration-300 absolute top-0 bg-black/30 w-screen h-screen' +
                    (show ? '' : ' invisible opacity-0')
                    // opacity 0 to make transition work
                }
            >
                {/* backdrop */}
            </div>
            <div
                className={
                    'transition-all ease-in-out duration-300 flex absolute top-0 w-screen overflow-hidden ' +
                    (show ? 'h-screen' : 'h-0')
                }
                onClick={(ev) => ev.target === ev.currentTarget && hide()}
            >
                <div className="bg-white m-auto p-4 border rounded">
                    <div className="flex justify-between">
                        <h1 className="text-xl">Agregar personaje</h1>
                        <FaTimes onClick={hide} />
                    </div>
                    <br />

                    <CharacterForm {...{ formData, setFormData }} />

                    <br />
                    <div className="flex justify-between">
                        <p>{formData.entersActing.value}</p>
                        <SubmitFormButton onClick={submitTurn}>
                            Agregar y Cerrar
                        </SubmitFormButton>

                        <SubmitFormButton onClick={submitTurnAndCreateNew}>
                            Agregar y Crear Otro
                        </SubmitFormButton>
                    </div>
                </div>
            </div>
        </>
    );

    function submitTurn() {
        if (dispatchNewTurn()) {
            reset();
            hide();
        }
    }

    function submitTurnAndCreateNew() {
        if (dispatchNewTurn()) {
            reset();
        }
    }

    function dispatchNewTurn() {
        if (errors.length) {
            alert(errors.join('\n'));
            return false;
        }

        const newTurn: Turn = {
            actionsRemaining: 0,
            incapacitated: false,
            characterName: formData.characterName.value,
            actions: formData.actions.value,
            initiative: formData.initiative.value,
            turnState: TurnState.WAITING,
        };

        if (formData.entersActing.value) {
            newTurn.turnState = TurnState.ACTING;
            newTurn.actionsRemaining = newTurn.actions;
        }

        dispatchTurns({ type: 'agregar', turns: [newTurn] });
        return true;
    }

    function reset() {
        setFormData(formDataInitialState());
    }
}

function SubmitFormButton({ onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`
                text-white
                font-bold
                bg-green-700/75
                hover:bg-green-700
                py-1 px-2
                cursor-pointer
                text-sm
            `}
            type="button"
        >
            {children}
        </button>
    );
}
