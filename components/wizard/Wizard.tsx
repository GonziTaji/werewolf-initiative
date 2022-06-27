import { useTurns } from '../../hooks/useTurns';
import MultiCharacterForm from './MultiCharacterForm';
import NumberOfParticipantsForm from './NumberOfParticipantsForm';

export default function Wizard() {
    const { turns, dispatchTurns } = useTurns();

    return (
        <>
            <NumberOfParticipantsForm />
            <MultiCharacterForm />
        </>
    );

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
    })
}
