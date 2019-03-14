import { Component, OnInit } from '@angular/core';
import { FlightSuretyService } from '../services/flight-surety-server.service';
import { Observable } from 'rxjs';
import { FlightDetail } from '../models/flight-details.model';

@Component({
  selector: 'app-passenger-page',
  templateUrl: './passenger-page.component.html',
  styleUrls: ['./passenger-page.component.scss']
})
export class PassengerPageComponent implements OnInit {

  private flightDetails: FlightDetail[];

  constructor(private flightSuretyService: FlightSuretyService) { }

  ngOnInit() {
    this.flightSuretyService.getFlightDetails().subscribe((response: any) => {
      this.flightDetails = response.data;
      console.log(this.flightDetails);
    });
  }

}
