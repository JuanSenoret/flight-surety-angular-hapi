import { Injectable, Inject } from '@angular/core';


import {SmartContract } from '../services/smart-contract.service';
import {TruffleContract} from 'truffle-contract';

import { Observable, of, from } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';

// Web3
import { WEB3 } from '../services/smart-contract.service';
import Web3 from 'web3';

@Injectable()
export class AttackChangeService {

    constructor(   @Inject(WEB3) private web3: Web3,
      @Inject(SmartContract) private smartContract: TruffleContract) {
     }


    public getAttack(): Observable<string> {
       // !!! here we are using the from operator to convert Promise to Observable
        // see https://www.learnrxjs.io/operators/creation/from.html
        // !!phenomenal
        return from(this.smartContract.deployed()).pipe(
            switchMap((instance: any) => from<string>(instance.currentAttack())
        ));

    }


    public setAttack(name: string): Observable<any> {

        return from(this.smartContract.deployed()).pipe(
            switchMap((instance: any) =>
                   from(instance.changeAttack(name, {from: this.web3.eth.defaultAccount}))

            ));

        }


}
