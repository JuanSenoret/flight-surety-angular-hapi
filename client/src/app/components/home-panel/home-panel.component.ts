import { Component, OnInit  } from '@angular/core';


@Component({
  selector: 'app-home-panel',
  templateUrl: './home-panel.component.html',
  styleUrls: ['./home-panel.component.scss']
})
export class HomePanelComponent implements OnInit {

  pokemonName = 'Groundon';

  ngOnInit() {

  }

}
