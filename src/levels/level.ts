import { Application, Container, Graphics, ParticleContainer, Ticker } from 'pixi.js';
import { ILevelData } from '../../data/data';
import { IScene } from '../manager';
import { HumanPlayer } from '../players/human';
import { IAPlayer } from '../players/ia';
import { Player } from '../players/player';
import { assertExists } from '../utils/assert';
import { City } from './city';
import { Road } from './road';
import { Unit } from './unit';

export enum LevelEvent {
  BOOTSTRAPPED = 'bootstrapped',
}

export class Level extends Container implements IScene {
  public application: Application;
  public cities: City[] = [];
  private unitContainer: ParticleContainer = new ParticleContainer();
  private units: Unit[] = [];
  private players: Player[] = [];

  constructor(application: Application, levelData: ILevelData) {
    super();
    this.application = application;

    const background = new Graphics();
    background.beginFill(0xaaaaaa);
    background.drawRect(0, 0, application.view.width, application.view.height);
    this.addChild(background);

    for (let i = 0; i < levelData.players; i++) {
      this.players.push(i == 0 ? new HumanPlayer(i, this) : new IAPlayer(i, this));
    }

    // First pass to generate cities
    levelData.cities.forEach((cityData) => {
      const city = new City();
      city.x = cityData.x;
      city.y = cityData.y;
      if (cityData.type) {
        city.type = cityData.type;
      }
      if (cityData.owner !== undefined) {
        city.setPlayer(this.players[cityData.owner]);
      }
      this.cities.push(city);
    });

    // Second pass to generated edges
    levelData.cities.forEach((cityData, fromIndex) => {
      (cityData.roads || []).forEach((toIndex) => {
        const road = new Road(this.cities[fromIndex], this.cities[toIndex]);
        this.addChild(road);
      });
    });

    this.addChild(this.unitContainer);

    // Finally, add all cities
    this.cities.forEach((city) => this.addChild(city));

    this.interactive = true;

    Ticker.shared.add(this.updateCities, this);

    Ticker.shared.add(this.updateMovingUnits, this);

    this.emit(LevelEvent.BOOTSTRAPPED);
  }

  updateCities() {
    this.cities.forEach((c) => c.update(this, Ticker.shared.deltaMS));
  }

  updateMovingUnits() {
    this.units = this.units.filter((u) => u.update());
  }

  addMovingUnit(from: City, road: Road) {
    assertExists(from.player);
    const unit = new Unit(from, road, from.player);
    this.unitContainer.addChild(unit.getSprite());
    this.units.push(unit);
  }
}
