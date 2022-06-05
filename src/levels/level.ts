import { Application, Container, Graphics, InteractionEvent, ParticleContainer, Ticker } from 'pixi.js';
import { ILevelData } from '../../data/data';
import { IScene } from '../manager';
import { City } from './city';
import { Road } from './road';
import { Unit } from './unit';

export class Level extends Container implements IScene {
  application: Application;
  private cities: City[] = [];
  private selectedCity?: City = undefined;
  private unitContainer: ParticleContainer = new ParticleContainer();
  private units: Unit[] = [];

  constructor(application: Application, levelData: ILevelData) {
    super();
    this.application = application;

    const background = new Graphics();
    background.beginFill(0xaaaaaa);
    background.drawRect(0, 0, application.view.width, application.view.height);
    this.addChild(background);
    this.addChild(this.unitContainer);

    // First pass to generate cities
    levelData.cities.forEach((cityData) => {
      const city = new City();
      city.x = cityData.x;
      city.y = cityData.y;
      this.cities.push(city);
      city.on('pointertap', this.onCitySelect, this);
    });

    // Second pass to generated edges
    levelData.cities.forEach((cityData, fromIndex) => {
      (cityData.roads || []).forEach((toIndex) => {
        const road = new Road(this.cities[fromIndex], this.cities[toIndex]);
        this.addChild(road);
      });
    });

    // Finally, add all cities
    this.cities.forEach((city) => this.addChild(city));

    this.interactive = true;
    this.on('pointertap', this.onUnselectAll, this);

    setInterval(this.updateCities.bind(this), 1000);

    Ticker.shared.add(this.updateUnits, this);
  }

  updateCities() {
    this.cities.forEach((c) => c.update(this));
  }

  updateUnits() {
    this.units = this.units.filter((u) => u.update());
  }

  onCitySelect(e: InteractionEvent) {
    if (e.target instanceof City) {
      if (e.target.state === City.POTENTIAL_TARGET && this.selectedCity) {
        this.selectedCity.addConnexion(e.target);
        this.selectedCity.stateDefault();
      } else {
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

  addUnit(from: City, road: Road) {
    const unit = new Unit(from, road);
    this.unitContainer.addChild(unit.getSprite());
    this.units.push(unit);
  }
}
