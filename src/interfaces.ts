import { TurnState } from './types';

export interface Turn extends TurnData {
    turnState: TurnState;
    actionsUsed: number;
    incapacitated: boolean;
}

export interface PartialTurn {
    turnState?: TurnState;
    actionsUsed?: number;
    incapacitated?: boolean;
    characterName?: string;
    initiative?: number;
    actions?: number;
}

export interface InitiativeFormData extends TurnData {
    entersActing: boolean;
}

export interface TurnData {
    characterName: string;
    initiative: number;
    actions: number;
}
