import React, { CSSProperties } from 'react';
import { InitiativeFormData } from '../interfaces';

export interface TurnFormState {
    form: InitiativeFormData;
}

interface TurnFormProps {
    submitForm: (turnForm: InitiativeFormData) => void
}

export default class TurnForm extends React.Component<
    TurnFormProps,
    TurnFormState
> {
    constructor(props: any) {
        super(props);

        this.state = {
            form: {
                characterName: '',
                initiative: 0,
                actions: 1,
                entersActing: false,
            }
        };

        // Event bindings for input handling
        this.submitForm = this.submitForm.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.formOnKeyDown = this.formOnKeyDown.bind(this);

    }

    style: {[key: string]: CSSProperties} = {
        container: {
        },
        card: {
            marginTop: 20
        }
    };

    characterNameInput: HTMLInputElement | null = null;
    initiativeInput: HTMLInputElement | null = null;
    actionsInput: HTMLInputElement | null = null;
    entersActingInput: HTMLInputElement | null = null;

    validateForm() {
        const { characterName, initiative, actions } = this.state.form;

        if (actions < 1) {
            this.actionsInput?.focus();
            this.actionsInput?.select();
            throw 'Al menos una accion es necesaria';
        }

        if (!characterName.trim()) {
            this.characterNameInput?.focus();
            this.characterNameInput?.select();
            throw 'El nombre no puede estar vacío';
        }

        if (initiative < 1) {
            this.initiativeInput?.focus();
            this.initiativeInput?.select();
            throw 'La iniciativa debe ser mayor a 0';
        }
    }

    submitForm() {
        try {
            this.validateForm();

            this.props.submitForm(this.state.form);

            alert('Turno agregado!');
            this.characterNameInput?.focus();
            this.characterNameInput?.select();

            this.setState({
                form: {
                    characterName: '',
                    initiative: 0,
                    actions: 1,
                    entersActing: false,
                }
            });
        } catch (e) {
            alert(e);
        }
    }

    onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
        let value: string | number | boolean | null = null;

        switch(e.currentTarget.id) {
            case 'initiative':
            case 'actions':
                value = parseInt(e.target.value);
                break;

            case 'characterName':
                value = e.target.value;
                break;

            case 'entersActing':
                value = e.currentTarget.checked;
                break;
            
            default:
                console.error(`${arguments.callee.name}: id '${e.currentTarget.id}' of currentarget not recorgnized`);
                break;
        }

        if (value !== null) {
            this.setState({
                form: {
                    ...this.state.form,
                    [e.currentTarget.id]: value,
                },
            });
        }
    }

    formOnKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            this.submitForm();
        }
    }

    render() {
        return (
            <div className="card" style={this.style.card}>
                <div className="card-header">
                    Ingreso de personaje
                </div>

                <div className="card-body">
                    <form onKeyDown={this.formOnKeyDown}>
                        <label htmlFor="character-name"> Personaje </label>
                        <input
                            className="form-control"
                            type="text"
                            id="characterName"
                            value={this.state.form.characterName}
                            onChange={this.onChangeInput}
                            ref={(inputEl) =>
                                (this.characterNameInput = inputEl)
                            }
                        />

                        <label htmlFor="initiative"> Iniciativa </label>
                        <input
                            className="form-control"
                            type="number"
                            id="initiative"
                            value={this.state.form.initiative}
                            onChange={this.onChangeInput}
                            ref={(inputEl) =>
                                (this.initiativeInput = inputEl)
                            }
                        />

                        <label htmlFor="actions"> Acciones </label>
                        <input
                            className="form-control"
                            type="number"
                            id="actions"
                            value={this.state.form.actions}
                            onChange={this.onChangeInput}
                            ref={(inputEl) =>
                                (this.actionsInput = inputEl)
                            }
                        />

                        <div className="form-check">
                            <label htmlFor="enters-acting"> Entra actuando </label>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="entersActing"
                                checked={this.state.form.entersActing}
                                onChange={this.onChangeInput}
                                ref={(inputEl) =>
                                    (this.entersActingInput = inputEl)
                                }
                            />
                        </div>
                    </form>
                </div>

                <div className="card-footer d-flex justify-content-end">
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={this.submitForm}
                    >
                        Agregar
                    </button>
                </div>
            </div>
        );
    }
}
