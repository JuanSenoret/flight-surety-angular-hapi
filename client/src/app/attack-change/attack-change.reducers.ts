
import * as attackChangeActions from './attack-change.actions';
import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import * as root from '../reducers';

// based on https://ngrx.io/guide/store/selectors
export interface State {
    attack: string;
}

const initialState: State  = {
  attack: null,
};


export const reducer = (state = initialState, action: attackChangeActions.ChangeAttackActionsUnion): State  => {
    switch (action.type) {

      case (attackChangeActions.ActionTypes.GET_ATTACK_SUCCESS): {
        return {...state, attack: action.payload};
      }

      case (attackChangeActions.ActionTypes.SET_ATTACK_SUCCESS): {
            return {...state, attack: action.payload };
      }
      case (attackChangeActions.ActionTypes.ETH_ERROR): {
            console.error('Got error:', action.payload);
            return state;
      }
      default: {
            return state;
      }
    }
};

// add new state slice
export interface AttackChangeState {
  attack: State ;
}

/**
 * Ethereum Global State
 */
export interface AppState extends root.AppState {
    attackState: AttackChangeState;
}

export const reducers: ActionReducerMap<AttackChangeState> = {
    attack: reducer
};


export const selectAttackChangeState = createFeatureSelector<AppState, AttackChangeState>('attackState');
export const getAttackChangeState = createSelector(selectAttackChangeState, (state: AttackChangeState) => state.attack);

export const getAttack = createSelector(getAttackChangeState, (state: State) => state.attack);

