import { Injectable, Inject } from '@angular/core';
import { AttackChangeService } from './attack-change.services';

// NGRX
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, from } from 'rxjs';

import * as fromAction from './attack-change.actions';

// RXJS
import { tap, switchMap, exhaustMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class AttackChangeEffects {
  constructor(
    private actions$: Actions<fromAction.ChangeAttackActionsUnion>,
    private ethSrv: AttackChangeService
  ) {}


   @Effect()
    GetAttack$: Observable<Action> = this.actions$.pipe(
      ofType(fromAction.ActionTypes.GET_ATTACK),
      switchMap(() => this.ethSrv.getAttack().pipe(
            map((name: string) => new fromAction.GetAttackSuccess(name)),
            catchError(err => of(new fromAction.EthError(err)))
          )),

    );


    @Effect()
    SetAttack$: Observable<Action> = this.actions$.pipe(
      ofType(fromAction.ActionTypes.SET_ATTACK),
      map((action: fromAction.SetAttack) => action.payload),
      exhaustMap((name: string) => this.ethSrv.setAttack(name).pipe(
            tap(result => console.log('result', result)),
            // retrieve the log information that will contain the event data.
            map(result => result.logs[0].args[0]),
            map((newName: string) => new fromAction.SetAttackSuccess(newName)),
            catchError(err => of(new fromAction.EthError(err)))
          )),

        );



}
