import { TurnState } from "./types";

export interface Turn extends TurnData {
    turnState: TurnState;
    actionsUsed: number;
}

export interface InitiativeFormData extends TurnData {
    entersActing: boolean;
}

export interface TurnData {
    characterName: string;
    initiative: number;
    actions: number;
}