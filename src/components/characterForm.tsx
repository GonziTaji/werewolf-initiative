import { CSSProperties, useEffect, useState } from 'react';
import { Turn } from '../interfaces';
import { TurnState } from '../types';

interface CharacterFormProps {
    submitForm: (newTurn: Turn) => void;
}

const formDataInitialState = () => ({
    characterName: '',
    initiative: 0,
    actions: 1,
    entersActing: false,
});

const errorInitialState = () => ({
    characterName: '',
    initiative: '',
    actions: '',
});

export function CharacterForm(props: CharacterFormProps) {
    const [formData, setFormData] = useState(formDataInitialState());
    const [errors, setErrors] = useState(errorInitialState());

    const style: { [key: string]: CSSProperties } = {
        container: {},
        card: {
            marginTop: 20,
        },
    };

    useEffect(() => {
        const errors = {
            characterName: '',
            initiative: '',
            actions: '',
        };

        if (!formData.characterName.trim()) {
            errors.characterName = 'El nombre no puede estar vacío';
        }

        if (formData.initiative < 1) {
            errors.initiative = 'La iniciativa debe ser mayor a 0';
        }

        if (formData.actions < 1) {
            errors.actions = 'Al menos una accion es necesaria';
        }

        setErrors(errors);
    }, [formData]);

    function updateForm(formPart: { [field: string]: any }) {
        setFormData({
            ...formData,
            ...formPart,
        });
    }

    function submitForm() {
        if (Object.values(errors).join('') === '') {
            props.submitForm({
                characterName: formData.characterName,
                initiative: formData.initiative,
                actions: formData.actions,
                turnState: formData.entersActing
                    ? TurnState.ACTING
                    : TurnState.WAITING,
                actionsUsed: 0,
                incapacitated: false,
            });
            setFormData(formDataInitialState());
        }
    }

    return (
        <div className="card" style={style.card}>
            <div className="card-header">Ingreso de personaje</div>

            <div className="card-body">
                <form>
                    <label htmlFor="character-name"> Personaje </label>
                    <input
                        className="form-control"
                        type="text"
                        value={formData.characterName}
                        onChange={(ev) =>
                            updateForm({
                                characterName: ev.currentTarget.value,
                            })
                        }
                    />
                    <small className="d-block text-danger">
                        {errors.characterName}
                    </small>

                    <label htmlFor="initiative"> Iniciativa </label>
                    <input
                        className="form-control"
                        type="number"
                        value={formData.initiative}
                        onChange={(ev) =>
                            updateForm({
                                initiative: parseInt(ev.currentTarget.value),
                            })
                        }
                    />
                    <small className="d-block text-danger">
                        {errors.initiative}
                    </small>

                    <label htmlFor="actions"> Acciones </label>
                    <input
                        className="form-control"
                        type="number"
                        value={formData.actions}
                        onChange={(ev) =>
                            updateForm({
                                actions: parseInt(ev.currentTarget.value),
                            })
                        }
                    />
                    <small className="d-block text-danger">
                        {errors.actions}
                    </small>

                    <div className="form-check">
                        <label htmlFor="enters-acting"> Entra actuando </label>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.entersActing}
                            onChange={(ev) =>
                                updateForm({
                                    entersActing: ev.currentTarget.checked,
                                })
                            }
                        />
                    </div>
                </form>
            </div>

            <div className="card-footer d-flex justify-content-end">
                <button
                    disabled={Object.values(errors).join('') !== ''}
                    className="btn btn-primary"
                    type="button"
                    onClick={submitForm}
                >
                    Agregar
                </button>
            </div>
        </div>
    );
}
