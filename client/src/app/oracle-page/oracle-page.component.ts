import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { WEB3, FlightSuretyAppSmartContract } from '../services/smart-contract.service';
import Web3 from 'web3';
import {TruffleContract} from 'truffle-contract';
import { EthereumService } from '../services/ethereum.service';
import { Observable, of, from } from 'rxjs';
import {exhaustMap, switchMap, map, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-oracle-page',
  templateUrl: './oracle-page.component.html',
  styleUrls: ['./oracle-page.component.scss']
})
export class OraclePageComponent implements OnInit, OnDestroy {

  private accounts: any[];
  private balance: number;
  constructor(@Inject(WEB3) private web3: Web3,
              @Inject(FlightSuretyAppSmartContract) private flightSuretyAppSmartContract: TruffleContract,
              private ethService: EthereumService) {
  }

  async ngOnInit() {
    if ('enable' in this.web3.currentProvider) {
      await this.web3.currentProvider.enable();
      this.accounts = await this.ethService.getAccounts();
      // Set manually the default account
      this.ethService.defaultAccount = this.accounts[0];

      await this.ethService.getAccountBalance().subscribe((response: any) => {
        this.balance = response;
        console.log(this.balance);
      });

      // set the provider for the FlightSuretyApp smart contract
      this.flightSuretyAppSmartContract.setProvider(this.web3.currentProvider);

      // Test function to fetch flights codes
      await this.getRegisteredFlightsCode();

      // Second method to call smart functions
      await this.getRegisteredFlightsCodev2().subscribe((response: string[]) => {
        console.log(response);
      });
    }
  }

  ngOnDestroy(): void {
  }

  private async getRegisteredFlightsCode() {

    this.flightSuretyAppSmartContract.deployed()
    .then((instance) => {
      return instance.fetchFlightsCodes.call({from: this.accounts[0]});
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(`Error in function getOracleFee ${error}`);
    });
  }

  private getRegisteredFlightsCodev2(): Observable<string[]> {
    return from(this.flightSuretyAppSmartContract.deployed()).pipe(
      switchMap((instance: any) => from<string[]>(instance.fetchFlightsCodes({from: this.accounts[0]}))
    ));
  }
}
