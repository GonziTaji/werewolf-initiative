import { useState } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { useTurns } from '../../hooks/useTurns';
import { SimpleCharacterFormData } from '../../interfaces';
import ActorsCountForm from './ActorsCountForm';
import SimpleCharacterForm from './SimpleCharacterForm';

export default function TurnSetup() {
    const { turns, dispatchTurns } = useTurns();
    const [forms, setForms] = useState([initialFormData()]);
    const [deletedForms, setDeletedForms] = useState(
        [] as SimpleCharacterFormData[]
    );

    return (
        <>
            <div className="sticky top-0 shadow-md">
                <h1 className="text-xl text-center">Comenzando Encuentro</h1>

                <div
                    className="grid grid-cols-2 border border-black bg-teal-100 px-3"
                    style={{ height: '5rem' }}
                >
                    <button
                        onClick={() => alert('en construcción')}
                        className="text-left  h-full"
                    >
                        <FaCaretLeft className="inline" />
                        Atrás
                        <small className="block px-2">Menú</small>
                    </button>

                    <button
                        onClick={() => alert('Not implemented')}
                        className="text-right h-full"
                    >
                        Siguiente
                        <FaCaretRight className="inline" />
                        <small className="block px-2">Comenzar encuentro</small>
                    </button>
                </div>
            </div>

            <div className="text-center shadow border border-black my-5 py-2 pb-5">
                <h1 className="pb-6 text-xl max-w-md mx-auto">
                    Numero de participantes
                </h1>
                <ActorsCountForm
                    participantsCount={forms.length}
                    setParticipantsCount={updateFormCount}
                />
            </div>

            <div className="shadow border border-black my-5 py-2 pb-5">
                <div className="text-center block my-5">
                    <h1 className="text-xl px-5">Info de Participantes</h1>
                </div>
                <div className="px-2 space-y-2">
                    <div className="grid grid-cols-[3fr_1fr_1fr]">
                        <label>Nombre</label>
                        <label>Iniciativa</label>
                        <label>Acciones</label>
                    </div>
                    {forms.map((formData, i) => (
                        <SimpleCharacterForm
                            key={i}
                            form={formData}
                            setForm={(form) => updateForm(i, form)}
                        />
                    ))}
                </div>
            </div>
        </>
    );

    function updateFormCount(count: number) {
        const newForms = [];
        const newDeletedForms = [...deletedForms];

        for (let i = 0; i < count; i++) {
            if (forms[i]) {
                newForms.push({ ...forms[i] });
            } else if (deletedForms.length) {
                newForms.push(newDeletedForms.shift());
            } else {
                newForms.push(initialFormData());
            }
        }

        for (let i = newForms.length; i < forms.length; i++) {
            if (forms[i].characterName.value) {
                newDeletedForms.push(forms[i]);
            }
        }

        setForms(newForms);
        setDeletedForms(newDeletedForms);
    }

    function updateForm(index: number, newForm: SimpleCharacterFormData) {
        const newForms = forms.map((form, i) =>
            i === index ? { ...newForm } : { ...form }
        );
        setForms(newForms);
    }
}

const initialFormData = (): SimpleCharacterFormData => ({
    characterName: {
        value: '',
        type: 'text',
        label: 'Nombre',
        errorMsg: 'Nombre no puede estar vacío',
        className: '',
        isValid: false,
        validator: (value: string) => !!value.trim(),
    },
    initiative: {
        value: 1,
        type: 'number',
        label: 'Iniciativa',
        errorMsg: 'Iniciativa debe ser mayor a 0',
        className: '',
        isValid: true,
        validator: (value: number) => value > 0,
    },
    actions: {
        value: 1,
        type: 'number',
        label: 'Acciones',
        errorMsg: 'Acciones debe ser mayor a 0',
        className: '',
        isValid: true,
        validator: (value: number) => value > 0,
    },
});
