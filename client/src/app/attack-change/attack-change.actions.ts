import { Action } from '@ngrx/store';

export enum ActionTypes {
  SET_ATTACK = '[Change Attack] Set Attack',
  SET_ATTACK_SUCCESS = '[Change Attack] Set Attack Success',
  GET_ATTACK = '[Change Attack] Get Attack',
  GET_ATTACK_SUCCESS = '[Change Attack] Get Attack Success',
  ETH_ERROR = '[Change Attack] Error',

}

/**
 * ACTIONS
 */
export class SetAttack implements Action {
  readonly type = ActionTypes.SET_ATTACK;
  constructor(public payload: string) {}
}


export class SetAttackSuccess implements Action {
  readonly type = ActionTypes.SET_ATTACK_SUCCESS;
  constructor(public payload: string) {}
}

export class GetAttack implements Action {
  readonly type = ActionTypes.GET_ATTACK;
}


export class GetAttackSuccess implements Action {
  readonly type = ActionTypes.GET_ATTACK_SUCCESS;
  constructor(public payload: string) {}
}


export class EthError implements Action {
    readonly type = ActionTypes.ETH_ERROR;
    constructor(public payload: any) {}
 }

export type ChangeAttackActionsUnion =
    | SetAttack
    | SetAttackSuccess
    | GetAttack
    | GetAttackSuccess
    | EthError;
