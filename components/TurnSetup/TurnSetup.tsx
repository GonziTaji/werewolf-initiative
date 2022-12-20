import router from 'next/router';
import { useState } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { useTurns } from '../../hooks/useTurns';
import { SimpleCharacterFormData } from '../../interfaces';
import { TurnState } from '../../types';
import PageHeader from '../PageHeader';

import SimpleCharacterForm from './SimpleCharacterForm';

export default function TurnSetup() {
    const { dispatchTurns } = useTurns();
    const [forms, setForms] = useState([initialFormData()]);
    const [deletedForms, setDeletedForms] = useState(
        [] as SimpleCharacterFormData[]
    );

    return (
        <>
            <PageHeader title="Nuevo encuentro" className="sticky top-0">
                <div className="grid grid-cols-2">
                    <button
                        className="text-left"
                        onClick={() => router.push('/')}
                    >
                        <FaCaretLeft className="inline" />
                        Atrás
                        <small className="block px-2">Menú</small>
                    </button>

                    <button onClick={startEncounter} className="text-right">
                        Siguiente
                        <FaCaretRight className="inline" />
                        <small className="block px-2">Comenzar encuentro</small>
                    </button>
                </div>
            </PageHeader>

            <div className="shadow border border-black my-5 py-2 pb-5 min-h-[]">
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

                <small className="block text-xs italic pl-4 pt-2">
                    Al llenar el nombre aparecerá otra fila
                </small>
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
        console.log(newForms[newForms.length - 1]);
        if (newForms[newForms.length - 1].characterName.value) {
            console.log('in');
            updateFormCount(newForms.length + 1);
        }
    }

    function startEncounter() {
        const newTurns = forms
            .filter((formData) => formData.characterName.isValid)
            .map((formData) => ({
                actions: formData.actions.value,
                characterName: formData.characterName.value,
                initiative: formData.initiative.value,
                incapacitated: false,
                turnState: TurnState.WAITING,
                actionsRemaining: formData.actions.value,
            }));

        if (newTurns.length === 0) {
            alert('Al menos agregue el nombre de un personaje');
            return;
        }

        router
            .push('/encounter')
            .then(() => dispatchTurns({ type: 'comenzar', turns: newTurns }));
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
