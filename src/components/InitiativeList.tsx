import React from 'react';
import { InitiativeFormData, Turn } from '../interfaces';
import { TurnState } from '../types';
import TurnElement from './turnElement';

export interface InitiativeListState {
    form: InitiativeFormData;
    turnList: Turn[];
    /** -1 if turns have not started */
    turnIndex: number;
    /** -1 if turns have not started */
    roundIndex: number;
}

export default class InitiativeList extends React.Component<
    {},
    InitiativeListState
> {
    constructor(props: any) {
        super(props);

        this.state = {
            form: {
                characterName: '',
                initiative: 0,
                actions: 1,
                entersActing: false,
            },
            turnList: [],
            turnIndex: -1,
            roundIndex: -1,
        };

        // Event bindings for input handling
        this.addInputToList = this.addInputToList.bind(this);
        this.onChangeInitiative = this.onChangeInitiative.bind(this);
        this.onChangeCharacterName = this.onChangeCharacterName.bind(this);
        this.onChangeActions = this.onChangeActions.bind(this);
        this.onChangeEntersActing = this.onChangeEntersActing.bind(this);
        this.formOnKeyDown = this.formOnKeyDown.bind(this);

        // Event bindings for turn system
        this.setPreviousState = this.setPreviousState.bind(this);
    }

    style = {
        container: {
            maxWidth: '600px',
            margin: 'auto',
        },
    };

    characterNameInput: HTMLInputElement | null = null;

    previousTurnStates: InitiativeListState[] = [];

    componentDidUpdate(_prevProps: any, prevState: InitiativeListState) {
        if (prevState.turnIndex !== this.state.turnIndex) {
            this.previousTurnStates.push(prevState);
        }
    }

    componentDidMount() {
        // to debug
        this.setState({
            form: {
                characterName: '',
                initiative: 0,
                actions: 1,
                entersActing: false,
            },
            turnList: [
                {
                    characterName: 'personaje 2',
                    initiative: 20,
                    actions: 1,
                    turnState: TurnState.WAITING,
                    actionsUsed: 0,
                },
                {
                    characterName: 'personaje 3',
                    initiative: 13,
                    actions: 1,
                    turnState: TurnState.WAITING,
                    actionsUsed: 0,
                },
                {
                    characterName: 'personaje 1',
                    initiative: 10,
                    actions: 1,
                    turnState: TurnState.WAITING,
                    actionsUsed: 0,
                },
            ],
            turnIndex: -1,
            roundIndex: -1,
        });
    }

    setPreviousState() {
        const newState = this.previousTurnStates.pop();
        console.log(this.previousTurnStates);
        console.log(newState);
        if (!newState) {
            alert('No hay acciones que deshacer');
        } else {
            this.setState(newState);
        }
    }

    // ---
    // Input handling methods
    addInputToList() {
        if (!this.state.form.initiative) {
            alert('Iniciativa en cero!');
            return;
        }

        const newTurn: Turn = {
            characterName: this.state.form.characterName,
            initiative: this.state.form.initiative,
            actions: this.state.form.actions,
            turnState: TurnState.WAITING,
            actionsUsed: 0,
        };

        this.setState({
            form: {
                characterName: '',
                initiative: 0,
                actions: 1,
                entersActing: false,
            },
            turnList: this.orderByInitiative([...this.state.turnList, newTurn]),
        });

        this.characterNameInput?.focus();
    }

    onChangeInitiative(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            form: {
                ...this.state.form,
                initiative: parseInt(e.target.value),
            },
        });
    }

    onChangeCharacterName(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            form: {
                ...this.state.form,
                characterName: e.currentTarget.value,
            },
        });
    }

    onChangeActions(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            form: {
                ...this.state.form,
                characterName: e.currentTarget.value,
            },
        });
    }

    onChangeEntersActing(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            form: {
                ...this.state.form,
                entersActing: e.currentTarget.checked,
            },
        });
    }

    orderByInitiative(input: Turn[]) {
        return input.sort((a, b) => (a.initiative < b.initiative ? 1 : -1));
    }

    formOnKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            this.addInputToList();
        }
    }

    // ---
    // Turn handling methods
    old_nextTurn(e: React.MouseEvent) {
        const skipped = e.currentTarget.id === 'btn-skip';

        let turnIndex = this.state.turnIndex + 1;
        let roundIndex = this.state.roundIndex;

        if (roundIndex === -1 || turnIndex === this.state.turnList.length) {
            roundIndex++;
            turnIndex = 0;
        }

        const turns = this.state.turnList.map((t, i) => {
            if (i === this.state.turnIndex) {
                t.turnState = skipped ? TurnState.HOLD : TurnState.WAITING;
            }

            if (i === turnIndex) {
                t.turnState = TurnState.ACTING;
            }

            return t;
        });

        this.setState({
            turnList: turns,
            roundIndex,
            turnIndex,
        });
    }

    finishTurn(
        index: number,
        finishingTurnState:
            | TurnState.WAITING
            | TurnState.HOLD = TurnState.WAITING
    ) {
        const turnList = this.state.turnList;

        turnList[index].turnState = finishingTurnState;

        this.setState({ turnList }, () => {
            if (turnList.filter(t => t.turnState === TurnState.ACTING).length === 0) {
                this.nextTurn()
            }
        })
    }

    skipTurn(index: number) {
        const turns = this.state.turnList;

        turns[index].turnState = TurnState.WAITING;
    }

    nextTurn() {
        let turnIndex = this.state.turnIndex + 1;
        let roundIndex = this.state.roundIndex;

        if (roundIndex === -1 || turnIndex === this.state.turnList.length) {
            roundIndex++;
            turnIndex = 0;
        }

        const turns = this.state.turnList.map((t, i) => {
            if (i === turnIndex) {
                console.log('turnIndex', turnIndex);
                t.turnState = TurnState.ACTING;
            }

            return t;
        });

        this.setState({
            turnList: turns,
            roundIndex,
            turnIndex,
        });
    }

    useSavedTurn(index: number) {
        const turns = this.state.turnList.map((t, i) => {
            if (i === index) {
                t.turnState = TurnState.ACTING;
            }
            return t;
        });

        this.setState({
            turnList: turns,
        });
    }

    render() {
        return (
            <div style={this.style.container}>
                <form onKeyDown={this.formOnKeyDown}>
                    <div>
                        <label htmlFor="character-name"> Personaje </label>
                        <input
                            className="form-control"
                            type="text"
                            id="character-name"
                            value={this.state.form.characterName}
                            onChange={this.onChangeCharacterName}
                            ref={(inputEl) =>
                                (this.characterNameInput = inputEl)
                            }
                        />
                    </div>

                    <div>
                        <label htmlFor="initiative"> Iniciativa </label>
                        <input
                            className="form-control"
                            type="number"
                            id="initiative"
                            value={this.state.form.initiative}
                            onChange={this.onChangeInitiative}
                        />
                    </div>

                    <div>
                        <label htmlFor="actions"> Acciones </label>
                        <input
                            className="form-control"
                            type="number"
                            id="actions"
                            value={this.state.form.actions}
                            onChange={this.onChangeActions}
                        />
                    </div>

                    <div className="form-check">
                        <label htmlFor="enters-acting"> Entra actuando </label>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="enters-acting"
                            checked={this.state.form.entersActing}
                            onChange={this.onChangeEntersActing}
                        />
                    </div>

                    <br />

                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={this.addInputToList}
                    >
                        Agregar
                    </button>
                </form>

                {/* Turn controls */}
                {this.state.roundIndex !== -1 && (
                    <button
                        onClick={this.setPreviousState}
                        className="btn btn-warning"
                        disabled={this.previousTurnStates.length === 0}
                    >
                        Deshacer acción
                    </button>
                )}

                {this.state.roundIndex === -1 && (
                    <button
                        onClick={(e) => this.nextTurn()}
                        className="btn btn-success"
                    >
                        Comenzar
                    </button>
                )}

                {/* Turn List */}
                {this.state.turnList.map((item, i) => (
                    <TurnElement
                        key={i}
                        turn={item}
                        useSavedTurn={this.useSavedTurn.bind(this, i)}
                        holdTurn={this.finishTurn.bind(this, i, TurnState.HOLD)}
                        finishTurn={this.finishTurn.bind(this, i, TurnState.WAITING)}
                    ></TurnElement>
                ))}
            </div>
        );
    }
}
