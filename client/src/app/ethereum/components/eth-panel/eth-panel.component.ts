import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


import { Store, select } from '@ngrx/store';
import * as fromEth from '../../index';

import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';


@Component({
  selector: 'app-eth-panel',
  templateUrl: './eth-panel.component.html',
  styleUrls: ['./eth-panel.component.scss']
})
export class EthPanelComponent implements OnInit, OnDestroy {

  public accounts$: Observable<string[]>;
  public defaultAcc: string;
  public balance$: Observable<string>;

  constructor(private formBuilder: FormBuilder,
    private store: Store<fromEth.AppState>) {}

    frmGroup: FormGroup = this.formBuilder.group({
      defoAdr: ''
    });
    private unsubscribe$: Subject<void> = new Subject<void>();

  ngOnInit() {

    // dispatch action to get default account balance
    [new fromEth.GetAccountBalance()].forEach(a => this.store.dispatch(a) );

    this.balance$ = this.store.pipe(select(fromEth.getAccountBalance));
    this.accounts$ = this.store.pipe(select(fromEth.getAllAccounts));

    this.store
      .pipe(
        select(fromEth.getDefaultAccount),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(address => {
          this.defaultAcc = address;
          this.frmGroup.setValue({defoAdr: address});
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onRadioChange(event): void {

    console.log(event.source.name, event.value);
    // mat-radio-group-0 0xa8a4b332674b34e127a7a5ebc242ee54d482329a
    const addr = this.frmGroup.value.defoAdr;
    console.log('addr', addr);

    this.store.dispatch(new fromEth.SetDefaultAccount(addr));
  }

}
