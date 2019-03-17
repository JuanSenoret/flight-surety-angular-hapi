import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassengerPageComponent } from './passenger-page/passenger-page.component';
import { OraclePageComponent } from './oracle-page/oracle-page.component';
import { MyInsurancesPageComponent} from './my-insurances-page/my-insurances-page.component';

const routes: Routes = [
  { path: 'passenger-page', component: PassengerPageComponent },
  { path: 'my-insurances-page', component: MyInsurancesPageComponent },
  { path: 'oracle-page', component: OraclePageComponent },
  { path: '', component: PassengerPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
