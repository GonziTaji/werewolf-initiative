import { ReactElement, ReactNode } from 'react';
import { TurnState } from './types';

export interface Turn extends TurnData {
    id?: string;
    turnState: TurnState;
    incapacitated: boolean;
}

export interface PartialTurn {
    id?: string;
    turnState?: TurnState;
    actionsRemaining?: number;
    incapacitated?: boolean;
    characterName?: string;
    initiative?: number;
    actions?: number;
    usoRabia?: boolean;
    isSavedTurn?: boolean;
    isOwnTurn?: boolean;
}

export interface InitiativeFormData extends TurnData {
    entersActing: boolean;
}

export interface TurnData extends PartialTurn {
    characterName: string;
    initiative: number;
    actions: number;
}

export interface ComponentBaseProps<T = any> {
    children?: ReactElement<T> | ReactElement<T>[] | string;
    className?: string;
    style?: React.CSSProperties;
}

export interface FormControlData<T> {
    value: T;
    type: string;
    label: string;
    errorMsg?: string;
    isValid: boolean;
    className: string;
    validator?: (value: T) => boolean;
}

export interface SimpleCharacterFormData {
    characterName: FormControlData<any>;
    initiative: FormControlData<any>;
    actions: FormControlData<any>;
}
