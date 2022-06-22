import { Fragment, SyntheticEvent, useState } from 'react';
import { Turn } from '../interfaces';
import { TurnState } from '../types';
import Input from './Input';
interface CharacterFormProps {
    submitForm: (newTurn: Turn) => void;
}

interface FormControlData<T> {
    value: T;
    type: string;
    label: string;
    errorMsg?: string;
    isValid: boolean;
    className: string;
    validator?: (value: T) => boolean;
}

export default function CharacterForm(props: CharacterFormProps) {
    const [formData, setFormData] = useState(formDataInitialState());

    function submitForm() {
        if (!isValid()) {
            const errors = [];

            for (const key in formData) {
                if (!formData[key].isValid) {
                    if (formData[key].errorMsg) {
                        errors.push(formData[key].errorMsg);
                    } else {
                        errors.push(`Campo inválido: ${formData[key].label}`);
                    }
                }
            }

            alert(errors.join('\n'));
            return;
        }

        const formValues: any = {
            turnState: formData.entersActing.value
                ? TurnState.ACTING
                : TurnState.WAITING,
            actionsRemaining: 0,
            incapacitated: false,
        };

        for (const key in formData) {
            formValues[key] = formData[key].value;
        }

        props.submitForm(formValues);
        setFormData(formDataInitialState());
    }

    function isValid() {
        for (const key in formData) {
            if (!formData[key].isValid) {
                return false;
            }
        }

        return true;
    }

    function inputOnChange(ev: SyntheticEvent<HTMLInputElement>) {
        const currentTarget = ev.currentTarget;
        const controlKey = currentTarget.id;

        const newFormData = { ...formData };
        const controlData = newFormData[controlKey];

        switch (currentTarget.type) {
            case 'number':
                controlData.value = parseInt(ev.currentTarget.value);
                break;

            case 'checkbox':
                controlData.value = ev.currentTarget.checked;
                break;

            default:
                controlData.value = ev.currentTarget.value;
                break;
        }

        if (controlData.validator) {
            controlData.isValid = controlData.validator(controlData.value);
        }

        setFormData(newFormData);
    }

    return (
        <form className="grid gap-y-2 grid-cols-auto-1fr">
            {Object.entries(formData).map(([controlKey, formControl], i) => (
                <Fragment key={i}>
                    <label className="pr-4" htmlFor={controlKey}>
                        {formControl.label}
                    </label>

                    <Input
                        id={controlKey}
                        className={formControl.type !== 'checkbox' && 'w-full '}
                        type={formControl.type}
                        value={formControl.value}
                        onChange={inputOnChange}
                        isValid={formControl.isValid}
                        errorMsg={formControl.errorMsg}
                    />
                </Fragment>
            ))}

            <button
                className={`
                        col-start-2
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
                        py-1
                        px-2
                        cursor-pointer
                        font-bold
                    `}
                type="button"
                onClick={submitForm}
            >
                Agregar
            </button>
        </form>
    );
}

const formDataInitialState = (): { [key: string]: FormControlData<any> } => ({
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
