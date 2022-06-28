import { SimpleCharacterFormData, Turn } from '../../interfaces';
import Input from '../Input';

interface SimpleCharacterFormProps {
    form: SimpleCharacterFormData;
    setForm: (form: SimpleCharacterFormData) => void;
}

export default function SimpleCharacterForm({
    form,
    setForm,
}: SimpleCharacterFormProps) {
    return (
        <form
            className="grid gap-1"
            style={{
                gridTemplateColumns: '3fr 1fr 1fr',
            }}
        >
            <Input
                value={form.characterName.value}
                placeholder="Nombre"
                onChange={(ev) =>
                    updateForm('characterName', ev.currentTarget.value)
                }
                isValid={form.characterName.isValid}
                errorMsg={form.characterName.errorMsg}
            />

            <Input
                className=""
                value={form.initiative.value}
                placeholder="Iniciativa"
                onChange={(ev) =>
                    updateForm(
                        'initiative',
                        parseInt(ev.currentTarget.value) || 0
                    )
                }
                isValid={form.initiative.isValid}
                errorMsg={form.initiative.errorMsg}
            />

            <Input
                className=""
                type={form.actions.type}
                placeholder="Acciones"
                value={form.actions.value}
                onChange={(ev) =>
                    updateForm('actions', parseInt(ev.currentTarget.value) || 0)
                }
                isValid={form.actions.isValid}
                errorMsg={form.actions.errorMsg}
            />
        </form>
    );

    function updateForm(key: string, value: any) {
        const newForm = { ...form };
        const control = newForm[key];

        control.value = value;

        if (control.validator) {
            control.isValid = control.validator(control.value);
        }

        setForm(newForm);
    }
}
