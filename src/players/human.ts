import { InteractionEvent } from 'pixi.js';
import { City } from '../levels/city';
import { Level } from '../levels/level';
import { Player } from './player';

export class HumanPlayer extends Player {
  private selectedCity?: City = undefined;

  constructor(index: number, level: Level) {
    super(index, level);

    level.once(Level.BOOTSTRAPPED, () => {
      level.cities.forEach((city) => {
        city.on('pointertap', this.onCitySelect, this);
      });

      level.on('pointertap', this.onUnselectAll, this);
    });
  }

  onCitySelect(e: InteractionEvent) {
    if (e.target instanceof City) {
      if (e.target.state === City.POTENTIAL_TARGET && this.selectedCity) {
        this.selectedCity.addConnexion(e.target);
        this.selectedCity.stateDefault();
      } else {
        if (e.target.player !== this) {
          return;
        }

        if (this.selectedCity) {
          this.selectedCity.stateDefault();
        }
        this.selectedCity = e.target;
        e.target.stateSelected();
      }
    }
    e.stopPropagation();
  }

  onUnselectAll() {
    if (this.selectedCity) {
      this.selectedCity.stateDefault();
    }
  }
}
