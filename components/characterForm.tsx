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
    validator?: (value: T) => boolean;
}

export default function CharacterForm(props: CharacterFormProps) {
    const [formData, setFormData] = useState(formDataInitialState());

    function submitForm() {
        if (!isValid()) {
            return;
        }

        const formValues: any = {
            turnState: formData.entersActing.value
                ? TurnState.ACTING
                : TurnState.WAITING,
            actionsUsed: 0,
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
        const controlKey = currentTarget.getAttribute('data-control-key') || '';

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
        <>
            <h2>Ingreso de personaje</h2>

            <form style={styles.form}>
                {Object.entries(formData).map(
                    ([controlKey, formControl], i) => (
                        <Fragment key={i}>
                            <label htmlFor={controlKey}>
                                {formControl.label}
                            </label>

                            <Input
                                data-control-key={controlKey}
                                style={{}}
                                type={formControl.type}
                                value={formControl.value}
                                onChange={inputOnChange}
                                isValid={formControl.isValid}
                                errorMsg={formControl.errorMsg}
                                errorClassName={'text-red'}
                            />
                        </Fragment>
                    )
                )}
            </form>

            <button
                disabled={!isValid()}
                className="btn btn-primary"
                type="button"
                onClick={submitForm}
            >
                Agregar
            </button>
        </>
    );
}

const formDataInitialState = (): { [key: string]: FormControlData<any> } => ({
    characterName: {
        value: '',
        type: 'text',
        label: 'Nombre',
        errorMsg: 'Nombre no puede estar vacío',
        isValid: false,
        validator: (value: string) => !!value.trim(),
    },
    initiative: {
        value: 1,
        type: 'number',
        label: 'Iniciativa',
        errorMsg: 'Iniciativa debe ser mayor a 0',
        isValid: true,
        validator: (value: number) => value > 0,
    },
    actions: {
        value: 1,
        type: 'number',
        label: 'Acciones',
        errorMsg: 'Acciones debe ser mayor a 0',
        isValid: true,
        validator: (value: number) => value > 0,
    },
    entersActing: {
        value: false,
        type: 'checkbox',
        label: 'Entra actuando',
        isValid: true,
    },
});

const styles = {
    form: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',

        label: {
            paddingRight: '1rem',
        },

        input: {
            width: '100%',

            '&[type=checkbox]': {
                width: 'auto',
            },
        },
    },
    error: {
        color: 'red',
    },
};
