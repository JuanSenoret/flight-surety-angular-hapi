import { Component } from '@angular/core';
import { transition, style, animate, trigger } from '@angular/animations';

export const DROP_POKE_ANIMATION = trigger('dropPoke', [
  transition(':enter', [
      style({ transform: 'translateY(-200px)', opacity: 0 }),
      animate(
          '750ms cubic-bezier(1.000, 0.000, 0.000, 1.000)',
          style({ transform: 'translateY(0)', opacity: 1 })
      ),
  ]),
  transition(':leave', [
      style({ transform: 'translateY(0)', opacity: 1 }),
      animate(
          '200ms cubic-bezier(1.000, 0.000, 0.000, 1.000)',
          style({ transform: 'translateY(-200px)', opacity: 0 })
      ),
  ]),
]);

@Component({
  selector: 'app-pokemon',
  animations: [DROP_POKE_ANIMATION],
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent {


}
