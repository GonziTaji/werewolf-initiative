import { useTurns } from '../../hooks/useTurns';
import MultiCharacterForm from './SimpleCharacterForm';
import NumberOfParticipantsForm from './NumberOfParticipantsForm';
import { SimpleCharacterFormData } from '../../interfaces';
import { useMemo, useState } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import Input from '../Input';

const stepNames = [
    'Cantidad de participantes',
    'Información de Turnos',
    'Comenzar encuentro',
];

const footerHeight = '5rem';

export default function Wizard() {
    const { turns, dispatchTurns } = useTurns();
    const [forms, setForms] = useState([initialFormData()]);

    const [step, setStep] = useState(0);

    const stepName = useMemo(() => {
        const _stepName = stepNames[step];

        if (!_stepName) throw 'Unexpected step index ' + step;

        return _stepName;
    }, [step]);

    return (
        <div className="">
            <h1 className="text-xl text-center">
                Paso {step + 1}: {stepName}
            </h1>
            <div
                className="grid grid-cols-2 border border-black"
                style={{ height: footerHeight }}
            >
                <button
                    disabled={step === 0}
                    onClick={() => setStep((s) => s - 1)}
                    className="text-left border-teal-300 bg-teal-100 disabled:text-gray-400 px-3 h-full"
                >
                    <FaCaretLeft className="inline" />
                    Atrás
                    <small className="block">{stepNames[step - 1]}&nbsp;</small>
                </button>

                <button
                    disabled={step === stepNames.length - 1}
                    onClick={validateStepAndGoNext}
                    className="text-right border-teal-300 bg-teal-100 disabled:text-gray-400 px-3 h-full"
                >
                    Siguiente
                    <FaCaretRight className="inline" />
                    <small className="block">{stepNames[step + 1]}&nbsp;</small>
                </button>
            </div>

            <WizardStep step={0} currentStep={step}>
                <div className="mt-10">
                    <NumberOfParticipantsForm
                        participantsCount={forms.length}
                        setParticipantsCount={updateFormCount}
                    />
                </div>
            </WizardStep>

            <WizardStep step={1} currentStep={step}>
                <span className="text-center block my-5">
                    <h1 className="text-3xl">
                        Ingrese los turnos en el orden que sea
                    </h1>
                </span>
                <div className="px-2 space-y-2">
                    <div className="grid grid-cols-[3fr_1fr_1fr]">
                        <label>Nombre</label>
                        <label>Iniciativa</label>
                        <label>Acciones</label>
                    </div>
                    {forms.map((formData, i) => (
                        <form
                            key={i}
                            className="grid gap-1"
                            style={{
                                gridTemplateColumns: '3fr 1fr 1fr',
                            }}
                        >
                            <Input
                                id={`index-${i}`}
                                className="h-8 align-middle"
                                value={formData.characterName.value}
                                placeholder="Nombre"
                                onChange={(ev) =>
                                    updateForm(
                                        i,
                                        'characterName',
                                        ev.currentTarget.value
                                    )
                                }
                                isValid={formData.characterName.isValid}
                                errorMsg={formData.characterName.errorMsg}
                            />

                            <Input
                                className="h- align-middle8"
                                value={formData.initiative.value}
                                placeholder="Iniciativa"
                                onChange={(ev) =>
                                    updateForm(
                                        i,
                                        'initiative',
                                        parseInt(ev.currentTarget.value) || 0
                                    )
                                }
                                isValid={formData.initiative.isValid}
                                errorMsg={formData.initiative.errorMsg}
                            />

                            <Input
                                className="h- align-middle8"
                                type={formData.actions.type}
                                placeholder="Acciones"
                                value={formData.actions.value}
                                onChange={(ev) =>
                                    updateForm(
                                        i,
                                        'actions',
                                        parseInt(ev.currentTarget.value) || 0
                                    )
                                }
                                isValid={formData.actions.isValid}
                                errorMsg={formData.actions.errorMsg}
                            />
                        </form>
                    ))}
                </div>
            </WizardStep>

            <WizardStep step={2} currentStep={step}>
                {[...forms]
                    .sort((a, b) =>
                        a.initiative.value < b.initiative.value ? 1 : -1
                    )
                    .map((form, i) => {
                        const info = {
                            characterName: form.characterName.value,
                            initiative: form.initiative.value,
                            actions: form.actions.value,
                        };
                        return (
                            <pre key={i} className="">
                                {JSON.stringify(info, null, 2)}
                            </pre>
                        );
                    })}
            </WizardStep>
        </div>
    );

    function validateStepAndGoNext() {
        // 1 = form
        if (step == 1) {
            const errors = [];
            for (let i = 0; i < forms.length; i++) {
                const form = forms[i];
                console.log(form);
                for (const key in form) {
                    if (!form[key].isValid) {
                        console.log(form[key]);
                        errors.push(`Linea ${i + 1}: ${form[key].errorMsg}`);
                    }
                }
            }

            if (errors.length) {
                alert('Hay errores en el formulario\n\n' + errors.join('\n'));
                return;
            }
        }

        setStep((s) => s + 1);
    }

    function updateFormCount(count: number) {
        const newForms = [];
        for (let i = 0; i < count; i++) {
            if (forms[i]) {
                newForms.push({ ...forms[i] });
            } else {
                newForms.push(initialFormData());
            }
        }

        setForms(newForms);
    }

    function updateForm(index: number, key: string, value: any) {
        const newForms = [...forms];
        console.log(newForms, forms);

        const control = newForms[index][key];

        control.value = value;

        if (control.validator) {
            control.isValid = control.validator(control.value);
        }

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

function WizardStep({ children, step, currentStep }) {
    return (
        <div className={`${step === currentStep ? 'block' : 'hidden'}`}>
            {children}
        </div>
    );
}
