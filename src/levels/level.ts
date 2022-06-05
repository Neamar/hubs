import { Application, Container, Graphics, InteractionEvent, Ticker } from 'pixi.js';
import { ILevelData } from '../../data/data';
import { IScene } from '../manager';
import { City } from './city';
import { Road } from './road';

export class Level extends Container implements IScene {
  application: Application;
  private cities: City[] = [];
  private selectedCity?: City = undefined;
  constructor(application: Application, levelData: ILevelData) {
    super();
    this.application = application;

    const background = new Graphics();
    background.beginFill(0xaaaaaa);
    background.drawRect(0, 0, application.view.width, application.view.height);
    this.addChild(background);

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
  }

  onCitySelect(e: InteractionEvent) {
    if (e.target instanceof City) {
      if (this.selectedCity) {
        this.selectedCity.stateDefault();
      }
      this.selectedCity = e.target;
      e.target.stateSelected();
    }
    e.stopPropagation();
  }

  onUnselectAll(e: InteractionEvent) {
    if (this.selectedCity) {
      this.selectedCity.stateDefault();
    }
  }
}
