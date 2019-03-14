import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PokemonComponent } from './components/pokemon/pokemon.component';
import { PassengerPageComponent } from './passenger-page/passenger-page.component';
import { OraclePageComponent } from './oracle-page/oracle-page.component';

const routes: Routes = [
  { path: 'passenger-page', component: PassengerPageComponent },
  { path: 'oracle-page', component: OraclePageComponent },
  { path: '', component: PassengerPageComponent },
  /*
  {
    path: '', redirectTo: '/pokey-home', pathMatch: 'full',
  },
  {
    path: 'pokey-home',
    component: PokemonComponent,
  },
  {
    path: 'eth-portal',
    loadChildren: './ethereum/eth.module#EthModule',
  },
  {
    path: 'pokey-attacks',
    loadChildren: './attack-change/attack-change.module#AttackChangeModule',
  },*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
