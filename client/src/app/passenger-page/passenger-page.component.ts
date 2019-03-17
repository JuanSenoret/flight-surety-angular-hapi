import { Component, Inject, OnInit } from '@angular/core';
import { FlightSuretyService } from '../services/flight-surety-server.service';
import { Observable, of, from } from 'rxjs';
import {exhaustMap, switchMap, map, tap, catchError } from 'rxjs/operators';
import { FlightDetails } from '../models/flight-details.model';
import { WEB3, FlightSuretyAppSmartContract } from '../services/smart-contract.service';
import Web3 from 'web3';
import {TruffleContract} from 'truffle-contract';
import { EthereumService } from '../services/ethereum.service';
import { SnackbarHomeComponent } from '../snackbar/snackbar-home/snackbar-home.component';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

@Component({
  selector: 'app-passenger-page',
  templateUrl: './passenger-page.component.html',
  styleUrls: ['./passenger-page.component.scss']
})
export class PassengerPageComponent implements OnInit {

  private flightDetailsByAirlines: any[];
  private airlines: string[];
  private flightsDetailsByArlineLufthansa: FlightDetails[];
  private flightsDetailsByArlineKlm: FlightDetails[];
  private flightsTableDisplayedColumns = ['code', 'departure', 'arrival', 'button'];
  private accounts: any[];
  private balance: number;
  private amounts: any[] = [
    {value: '0.01-ether-0', viewValue: '0.01 (Eth)', ethValue: '0.01'},
    {value: '0.02-ether-1', viewValue: '0.02 (Eth)', ethValue: '0.02'},
    {value: '0.03-ether-2', viewValue: '0.03 (Eth)', ethValue: '0.03'}
  ];
  private lufthansaSelectedAmountValue = '0.01-ether-0';
  private klmSelectedAmountValue = '0.01-ether-0';
  private configSnackbarSuccess: MatSnackBarConfig = {
    panelClass: 'snackbar-style-success',
    duration: 10000,
    verticalPosition: 'bottom'
  };
  private configSnackbarError: MatSnackBarConfig = {
    panelClass: 'snackbar-style-error',
    duration: 10000,
    verticalPosition: 'bottom'
  };

  constructor(
      @Inject(WEB3) private web3: Web3,
      @Inject(FlightSuretyAppSmartContract) private flightSuretyAppSmartContract: TruffleContract,
      private ethService: EthereumService,
      private flightSuretyService: FlightSuretyService,
      private snackBar: MatSnackBar
  ) { }

  async ngOnInit() {
    await this.flightSuretyService.getFlightDetails().subscribe((response: any) => {
      this.flightsDetailsByArlineLufthansa = response.data.filter(flight => flight.airlineName === 'Lufthansa');
      this.flightsDetailsByArlineKlm = response.data.filter(flight => flight.airlineName === 'KLM');
    });
    await this.initWeb3();
  }

  private async initWeb3() {
    if ('enable' in this.web3.currentProvider) {
      await this.web3.currentProvider.enable();
      this.accounts = await this.ethService.getAccounts();
      // Set manually the default account
      this.ethService.defaultAccount = this.accounts[0];
      // Get account balance
      await this.ethService.getAccountBalance().subscribe((response: any) => {
        this.balance = response;
        console.log(this.balance);
      });

      // set the provider for the FlightSuretyApp smart contract
      this.flightSuretyAppSmartContract.setProvider(this.web3.currentProvider);
    }
  }

  public async buyInsurance(code: string, airlineSelectedValue: string) {
    console.log(`Buy Insurance for flight ${code} amount ${this.amounts[airlineSelectedValue.slice(-1)].ethValue} Eth`);
    await this.buyInsuranceEth(code, this.amounts[airlineSelectedValue.slice(-1)].ethValue).subscribe((response: any) => {
      if (!(response === 'Error')) {
        if (response.logs[0]) {
          if (response.logs[0].event === 'BoughtInsurance') {
            // Launch the snack bar with the proper message
            this.snackBar.openFromComponent(SnackbarHomeComponent, {
              data: `Insurance successfully bought for flight ${this.web3.utils.toUtf8(response.logs[0].args.flightCode)}`,
              ...this.configSnackbarSuccess
            });
          } else {
            console.log(`Error buying insurance for flight ${code}`);
            this.snackBar.openFromComponent(SnackbarHomeComponent, {
              data: `Error buying insurance for flight ${code}`,
              ...this.configSnackbarError
            });
          }
        } else {
          console.log(`Error buying insurance for flight ${code}`);
          this.snackBar.openFromComponent(SnackbarHomeComponent, {
            data: `Error buying insurance for flight ${code}`,
            ...this.configSnackbarError
          });
        }
      } else {
        console.log(`Error buying insurance for flight ${code}`);
        this.snackBar.openFromComponent(SnackbarHomeComponent, {
          data: `Error buying insurance for flight ${code}`,
          ...this.configSnackbarError
        });
      }
    });
  }

  private buyInsuranceEth(code: string, amount: string): Observable<any> {
    return from(this.flightSuretyAppSmartContract.deployed()).pipe(
      switchMap((instance: any) => from <any> (
        instance.buyInsurance(
          this.web3.utils.asciiToHex(code),
          {from: this.accounts[0], value: this.web3.utils.toWei(amount, 'ether')}
        )
      )
    ),
    catchError((err: any) => from <any> (['Error']))
    );
  }
}
