 import React, { CSSProperties } from 'react';
import { InitiativeFormData, Turn } from '../interfaces';
import { TurnState } from '../types';
import TurnElement from './turnElement';
import TurnForm from './turnForm';

export interface InitiativeListState {
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
            turnList: [],
            turnIndex: -1,
            roundIndex: -1,
        };

        // Event bindings for input handling
        this.addInputToList = this.addInputToList.bind(this);
        this.goNextActorTurn = this.goNextActorTurn.bind(this);
    }

    style: {[key: string]: CSSProperties} = {
        container: {
        },
        card: {
            marginTop: 20
        }
    };

    // characterNameInput: HTMLInputElement | null = null;



    componentDidMount() {
        // to debug
        this.setState({
            turnList: [],
            turnIndex: -1,
            roundIndex: -1,
        });
    }

    // ---
    // Input handling methods
    addInputToList(turnForm: InitiativeFormData) {
        const newCharacterName = turnForm.characterName;

        const newTurn: Turn = {
            characterName: newCharacterName,
            initiative: turnForm.initiative,
            actions: turnForm.actions,
            turnState: turnForm.entersActing ? TurnState.ACTING : TurnState.WAITING,
            actionsUsed: 0,
            incapacitated: false,
        };

        if (this.state.turnList.find(turn => turn.characterName === newCharacterName)) {
            throw 'Ya existe un personaje con otro nombre. Cámbielo e inténtelo nuevamente';
        }

        let turnList = [],
            turnIndex = this.state.turnIndex;

        if (turnIndex !== -1) {
            turnList = this.orderByInitiative([...this.state.turnList, newTurn]);

            const currentTurnCharacterName = this.state.turnList[turnIndex].characterName;

            turnIndex = turnList.findIndex(t => t.characterName === currentTurnCharacterName);
        } else {
            turnList = this.orderByInitiative([...this.state.turnList, newTurn]);
        }

        this.setState({
            turnList,
            turnIndex: turnIndex
        });

        // this.characterNameInput?.focus();
    }

    orderByInitiative(input: Turn[]) {
        return input.sort((a, b) => (a.initiative < b.initiative ? 1 : -1));
    }

    // ---
    // Turn handling methods
    finishTurn(
        index: number,
        finishingTurnState:
            | TurnState.WAITING
            | TurnState.HOLD = TurnState.WAITING
    ) {
        const turnList = this.state.turnList;

        turnList[index].turnState = finishingTurnState;

        const callback = () => {
            const { length: actingCount } = turnList.filter(t => t.turnState === TurnState.ACTING);

            if (actingCount === 0) {
                this.goNextActorTurn()
            }
        }

        this.setState({ turnList }, callback);
    }

    goNextActorTurn() {
        if (this.state.turnList.length === 0) {
            return alert('No hay turnos disponibles');
        }

        let turnIndex = this.state.turnIndex + 1;
        let roundIndex = this.state.roundIndex;

        if (roundIndex === -1 || turnIndex === this.state.turnList.length) {
            roundIndex++;
            turnIndex = 0;
        }

        const turns = this.state.turnList.map((t, i) => {
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

    useSavedTurn(index: number) {
        const turns = this.state.turnList;

        turns[index].turnState = TurnState.ACTING;

        this.setState({
            turnList: turns,
        });
    }

    

    removeTurn(index: number) {
        const { turnList } = this.state;

        turnList.splice(index, 1);

        this.setState({ turnList });
    }

    incapacitateCharacter(index: number) {
        const { turnList } = this.state;

        const turnToIncapacitate = turnList[index];

        if (turnToIncapacitate) {
            turnToIncapacitate.incapacitated = true;

            const callback = () => {
                if (turnToIncapacitate.turnState === TurnState.ACTING) {
                    this.finishTurn(index);
                }
            }

            this.setState({ turnList }, callback);
        } else {
            alert('Algo salio mal: Turno no encontrado. Inténtelo nuevamente');
        }
    }

    capacitateIncapacitated(index: number) {
        const { turnList } = this.state;

        const turnToCapacitate = turnList[index];

        if (turnToCapacitate) {
            turnToCapacitate.incapacitated = false;

            this.setState({ turnList });
        }
    }

    render() {
        return (
            <div className="container" style={this.style.container}>
                <TurnForm submitForm={this.addInputToList}></TurnForm>

                <div className="card" style={this.style.card}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        Turnos

                        {/* Turn controls */}
                        {this.state.roundIndex === -1 && (
                            <button
                                onClick={this.goNextActorTurn}
                                className="btn btn-sm btn-link"
                            >
                                Comenzar
                            </button>
                        )}
                    </div>

                    <div className="card-body">
                        {/* Turn List */}
                        {this.state.turnList.map((item, i) => (
                            <TurnElement
                                key={i}
                                turn={item}
                                useSavedTurn={this.useSavedTurn.bind(this, i)}
                                holdTurn={this.finishTurn.bind(this, i, TurnState.HOLD)}
                                finishTurn={this.finishTurn.bind(this, i, TurnState.WAITING)}
                                removeTurn={this.removeTurn.bind(this, i)}
                                incapacitate={this.incapacitateCharacter.bind(this, i)}
                                capacitate={this.capacitateIncapacitated.bind(this,i)}
                            ></TurnElement>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
