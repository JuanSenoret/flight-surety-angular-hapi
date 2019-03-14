import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { WEB3 } from '../services/smart-contract.service';
import Web3 from 'web3';

@Component({
  selector: 'app-oracle-page',
  templateUrl: './oracle-page.component.html',
  styleUrls: ['./oracle-page.component.scss']
})
export class OraclePageComponent implements OnInit, OnDestroy {


  constructor(@Inject(WEB3) private web3: Web3) {
  }

  async ngOnInit() {
    if ('enable' in this.web3.currentProvider) {
      await this.web3.currentProvider.enable();
    }
    const accounts = await this.web3.eth.getAccounts();
    console.log(accounts);
  }

  ngOnDestroy(): void {
  }

}
