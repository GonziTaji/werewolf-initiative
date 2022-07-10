import { Fragment, SyntheticEvent } from 'react';
import Input from './Input';
interface CharacterFormProps {
    formData: CharacterFormData;
    setFormData: (formData: CharacterFormData) => void;
}

interface CharacterFormData {
    characterName: FormControlData<string>;
    initiative: FormControlData<number>;
    actions: FormControlData<number>;
    entersActing: FormControlData<boolean>;
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

export default function CharacterForm({
    formData,
    setFormData,
}: CharacterFormProps) {
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
        </form>
    );

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
}

export const formDataInitialState = (): CharacterFormData => ({
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
        errorMsg: '',
    },
});
