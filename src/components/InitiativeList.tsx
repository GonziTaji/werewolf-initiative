import React from 'react';

export default class InitiativeList extends React.Component<{}, InitiativeListState> {
    constructor(props: any) {
        super(props);

        this.state = {
            form: {
                characterName: '',
                initiative: 0,
                actions: 1,
            },
            turnList: [],
            turnIndex: -1,
            roundIndex: -1,
        }

        // Event bindings for input handling
        this.addInputToList = this.addInputToList.bind(this);
        this.onChangeInitiative = this.onChangeInitiative.bind(this);
        this.onChangeCharacterName = this.onChangeCharacterName.bind(this);
        this.onChangeActions = this.onChangeActions.bind(this);
        this.formOnKeyDown = this.formOnKeyDown.bind(this);

        // Event bindings for turn system
        this.nextTurn = this.nextTurn.bind(this);
        this.previousTurn = this.previousTurn.bind(this);
        this.useSavedTurn = this.useSavedTurn.bind(this);
    }

    style = {
        container: {
            'max-width': '600px',
            'margin': 'auto',
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
            turnState: 'WAITING',
            actionsUsed: 0,
        };

        this.setState({
            form: {
                characterName: '',
                initiative: 0,
                actions: 1
            },
            turnList: this.orderByInitiative([...this.state.turnList, newTurn])
        });
    }

    onChangeInitiative(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            form: {
                ...this.state.form,
                initiative: parseInt(e.target.value)
            }
        })
    }

    onChangeCharacterName(e: any) {
        this.setState({
            form: {
                ...this.state.form,
                characterName: e.target.value
            }
        })
    }

    onChangeActions(e: any) {
        this.setState({
            form: {
                ...this.state.form,
                characterName: e.target.value
            }
        })
    }

    orderByInitiative(input: Turn[]) {
        console.log(input);
        return input.sort((a, b) => a.initiative < b.initiative ? 1 : -1);
    }

    formOnKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            this.addInputToList();
        }
    }

    // ---
    // Turn handling methods
    nextTurn(e: React.MouseEvent) {
        const skipped = e.currentTarget.id === 'btn-skip';

        let turnIndex = this.state.turnIndex + 1;
        let roundIndex = this.state.roundIndex;

        if (roundIndex === -1 || turnIndex === this.state.turnList.length) {
            roundIndex++;
            turnIndex = 0;
        }
    
        const turns = this.state.turnList.map((t, i) => {
            if (i === this.state.turnIndex) {
                t.turnState = skipped ? 'HOLD' : 'WAITING'
            }

            if (i === turnIndex) {
                t.turnState = 'ACTING';
            }

            return t;
        });

        this.setState({
            turnList: turns,
            roundIndex,
            turnIndex,
        });
    }

    previousTurn() {

    }

    useSavedTurn(e: React.MouseEvent) {
        const index = e.currentTarget.getAttribute('data-index');

        const turns = this.state.turnList.map((t, i) => {
            if (i.toString() === index) {
                t.turnState = 'WAITING';
            }
            return t;
        })

        this.setState({
            turnList: turns
        });
    }

    render() {
        return (
            <div style={this.style.container}>
                <form onKeyDown={this.formOnKeyDown}>
                    <div>
                        <label htmlFor="character-name"> Personaje </label>
                        <input className="form-control" type="text" id="character-name"
                            value={this.state.form.characterName}
                            onChange={this.onChangeCharacterName}
                        />
                    </div>

                    <div>
                        <label htmlFor="initiative"> Iniciativa </label>
                        <input className="form-control" type="number" id="initiative"
                            value={this.state.form.initiative}
                            onChange={this.onChangeInitiative}
                        />
                    </div>

                    <div>
                        <label htmlFor="actions"> Acciones </label>
                        <input className="form-control" type="number" id="actions"
                            value={this.state.form.actions}
                            onChange={this.onChangeActions}
                        />
                    </div>

                    <br/>

                    <button className="btn btn-primary" type="button" onClick={this.addInputToList}>Agregar</button>
                </form>

                {/* Turn controls */}
                {
                    <button onClick={this.previousTurn} className="btn btn-warning" disabled={
                        this.state.roundIndex === -1 || (this.state.roundIndex === 0 && this.state.turnIndex === 0)
                    }>
                        Turno anterior
                    </button>   
                }

                <button onClick={this.nextTurn} className="btn btn-primary">{
                    this.state.roundIndex === -1 ? 'Comenzar' : 'Siguiente turno'
                }</button>

                <button onClick={this.nextTurn} id="btn-skip" className="btn btn-success" disabled={
                    this.state.turnIndex === -1
                }>
                    Guardar turno
                </button>

                {/* Turn List */}
                {this.state.turnList.map((item, i) => (
                    <div className="row">
                        <div className="col">
                            {item.initiative}
                        </div>

                        <div className="col">
                            {item.characterName.toUpperCase()}
                        </div>

                        <div className="col" data-index={i}>
                            {item.turnState} 
                            {item.turnState === 'HOLD' &&
                                <button className="btn btn-primary btn-outline"
                                    onClick={this.useSavedTurn}
                                >
                                    Usar Turno
                                </button>
                            }
                        </div>

                        <div className="col col-12">
                            <small>Acciones {item.actions}</small>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

interface InitiativeListState {
    form: InitiativeFormData;
    turnList: Turn[];
    /** -1 if turns have not started */
    turnIndex: number;
    /** -1 if turns have not started */
    roundIndex: number;
}

interface Turn extends InitiativeFormData {
    turnState: TurnState;
    actionsUsed: number;
}

interface InitiativeFormData {
    characterName: string;
    initiative: number;
    actions: number;
}

type TurnState = 'HOLD' | 'WAITING' | 'ACTING';