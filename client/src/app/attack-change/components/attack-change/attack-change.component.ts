import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import * as fromAttackChange from '../../index';

import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-attack-change',
  templateUrl: './attack-change.component.html',
  styleUrls: ['./attack-change.component.scss']
})
export class AttackChangeComponent implements OnInit, OnDestroy {
  public attack$: Observable<string>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromAttackChange.AppState>
  ) {}

  private unsubscribe$: Subject<void> = new Subject<void>();
  quickMoves: string[] = ['Mud Shot', 'Dragon Tail'];

  frmGroup: FormGroup = this.formBuilder.group({
    attack: ''
  });

  ngOnInit() {
    this.store.dispatch(new fromAttackChange.GetAttack());
    this.attack$ = this.store.pipe(select(fromAttackChange.getAttack));

    this.store
      .pipe(
        select(fromAttackChange.getAttackChangeState),
        takeUntil(this.unsubscribe$)
        // tap (state => console.log('attackState', state))
      )
      .subscribe(state => this.frmGroup.setValue(state));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onConfirm(): void {

    const model = this.frmGroup.value;
    // console.log('model', model);
    this.store.dispatch(new fromAttackChange.SetAttack(model.attack));
  }


}
