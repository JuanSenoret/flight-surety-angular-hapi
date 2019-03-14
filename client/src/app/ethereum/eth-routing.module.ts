import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as guards from './guards';
import { EthPanelComponent } from './components/eth-panel/eth-panel.component';


const routes: Routes = [
  {
      path: '',
      component: EthPanelComponent,
      canActivate: [guards.EthInitGuard],
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EthRoutingModule { }

