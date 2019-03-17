import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlightsPageComponent } from './flights-page/flights-page.component';
import { OraclePageComponent } from './oracle-page/oracle-page.component';
import { MyInsurancesPageComponent} from './my-insurances-page/my-insurances-page.component';

const routes: Routes = [
  { path: 'flights-page', component: FlightsPageComponent },
  { path: 'my-insurances-page', component: MyInsurancesPageComponent },
  { path: 'oracle-page', component: OraclePageComponent },
  { path: '', component: FlightsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
