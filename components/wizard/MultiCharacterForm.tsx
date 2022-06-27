import { Fragment, useState } from 'react';
import { useTurns } from '../../hooks/useTurns';
import { Turn } from '../../interfaces';
import { TurnState } from '../../types';
import Input from '../Input';

interface MultiCharacterFormProps {}

interface FormControlData<T> {
    value: T;
    type: string;
    label: string;
    errorMsg?: string;
    isValid: boolean;
    className: string;
    validator?: (value: T) => boolean;
}

interface FormData {
    characterName: FormControlData<any>;
    initiative: FormControlData<any>;
    actions: FormControlData<any>;
    entersActing: FormControlData<any>;
}

export default function MultiCharacterForm({}: MultiCharacterFormProps) {
    const [forms, setForms] = useState([initialFormData()]);

    const { dispatchTurns } = useTurns();

    return (
        <>
            <div className="px-2">
                <div className="flex items-stretch">
                    <h1 className="grow text-lg">Ingreso de turnos</h1>

                    <MinusButton
                        onClick={() => removeForm(forms.length - 1)}
                        disabled={forms.length === 1}
                    />

                    <Input
                        className="w-12 text-center rounded-none"
                        type="number"
                        min="1"
                        value={forms.length}
                        onInput={(ev) => {
                            const formCount = parseInt(ev.currentTarget.value);
                            const newForms = [];
                            for (let i = 0; i < formCount; i++) {
                                if (forms[i]) {
                                    newForms.push({ ...forms[i] });
                                } else {
                                    newForms.push(initialFormData());
                                }
                            }

                            setForms(newForms);
                        }}
                    />

                    <PlusButton onClick={addForm} />
                </div>

                <form
                    className="grid gap-1"
                    style={{
                        gridTemplateColumns: '1fr 3fr 1fr',
                    }}
                >
                    <label>Iniciativa</label>
                    <label>Nombre</label>
                    <label>Acciones</label>
                    {forms.map((formData, i) => (
                        <Fragment key={i}>
                            <Input
                                className=""
                                value={formData.initiative.value}
                                placeholder="Iniciativa"
                                onChange={(ev) =>
                                    inputOnChange(
                                        i,
                                        'initiative',
                                        parseInt(ev.currentTarget.value) || 0
                                    )
                                }
                                isValid={formData.initiative.isValid}
                                errorMsg={formData.initiative.errorMsg}
                            />

                            <Input
                                value={formData.characterName.value}
                                placeholder="Nombre"
                                onChange={(ev) =>
                                    inputOnChange(
                                        i,
                                        'characterName',
                                        ev.currentTarget.value
                                    )
                                }
                                isValid={formData.characterName.isValid}
                                errorMsg={formData.characterName.errorMsg}
                            />

                            <Input
                                className=""
                                type={formData.actions.type}
                                placeholder="Acciones"
                                value={formData.actions.value}
                                onChange={(ev) =>
                                    inputOnChange(
                                        i,
                                        'actions',
                                        parseInt(ev.currentTarget.value) || 0
                                    )
                                }
                                isValid={formData.actions.isValid}
                                errorMsg={formData.actions.errorMsg}
                            />
                        </Fragment>
                    ))}
                </form>

                <div className="flex justify-end mt-2">
                    <button
                        className={`
                        justify-self-end
                        hover:text-white
                        text-gray-100
                        hover:bg-green-600
                        bg-green-700
                        disabled:bg-green-200
                        disabled:text-gray-500
                        disabled:cursor-not-allowed
                        transition-colors
                        rounded-md
                        pb-1
                        px-2
                        cursor-pointer
                        font-bold
                    `}
                        type="button"
                        onClick={submitForm}
                    >
                        Agregar {forms.length} turno
                        {forms.length > 1 ? 's' : ''}
                    </button>
                </div>
            </div>
            <hr className="h-1 my-2 bg-rose-800" />
        </>
    );

    function submitForm() {
        if (!isValid()) {
            const errors = [];

            for (const formData of forms) {
                for (const key in formData) {
                    if (!formData[key].isValid) {
                        if (formData[key].errorMsg) {
                            errors.push(formData[key].errorMsg);
                        } else {
                            errors.push(
                                `Campo inválido: ${formData[key].label}`
                            );
                        }
                    }
                }
            }

            alert(errors.join('\n'));
            return;
        }

        const formValues = forms.map(
            ({ actions, characterName, entersActing, initiative }) =>
                ({
                    turnState: entersActing.value
                        ? TurnState.ACTING
                        : TurnState.WAITING,
                    actionsRemaining: entersActing ? actions : 0,
                    incapacitated: false,
                    characterName: characterName.value,
                    initiative: initiative.value,
                    actions: actions.value,
                } as Turn)
        );

        dispatchTurns({ type: 'agregar', turns: formValues });
        setForms([initialFormData()]);
    }

    function isValid() {
        for (const formData of forms) {
            for (const key in formData) {
                if (!formData[key].isValid) {
                    return false;
                }
            }
        }

        return true;
    }

    function inputOnChange(index: number, key: string, value: any) {
        const newForms = [...forms];
        const control = newForms[index][key];

        control.value = value;

        if (control.validator) {
            control.isValid = control.validator(control.value);
        }

        setForms(newForms);
    }

    function addForm() {
        setForms([...forms, initialFormData()]);
    }

    function removeForm(index: number) {
        const newForms = [...forms];

        newForms.splice(index, 1);

        setForms(newForms);
    }
}

const initialFormData = (): FormData => ({
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
    entersActing: {
        value: false,
        type: 'checkbox',
        label: 'Entra actuando',
        className: '',
        isValid: true,
    },
});

function MinusButton({ className = '', ...props }: ControlButtonProps) {
    className += ' border-r-0';
    return (
        <ControlButton className={className} {...props}>
            -
        </ControlButton>
    );
}

function PlusButton({ className = '', ...props }: ControlButtonProps) {
    className += ' border-l-0';
    return (
        <ControlButton className={className} {...props}>
            +
        </ControlButton>
    );
}

interface ControlButtonProps
    extends React.HTMLAttributes<HTMLButtonElement>,
        React.ButtonHTMLAttributes<HTMLButtonElement> {}

function ControlButton({
    className = '',
    onClick = () => {},
    children,
    ...props
}: ControlButtonProps) {
    return (
        <button
            {...props}
            className={
                className +
                `
                cursor-pointer
                disabled:cursor-not-allowed
                w-8
                border border-black
                font-bold
                bg-slate-300
                text-slate-600
                `
            }
            onClick={onClick}
        >
            {children}
        </button>
    );
}
