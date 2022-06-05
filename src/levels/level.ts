import { Application, Container, Ticker } from 'pixi.js';
import { ILevelData } from '../../data/data';
import { IScene } from '../manager';
import { City } from './city';
import { Road } from './road';

export class Level extends Container implements IScene {
  application: Application;
  private cities: City[] = [];
  constructor(application: Application, levelData: ILevelData) {
    super();
    this.application = application;

    // First pass to generate cities
    levelData.cities.forEach((cityData) => {
      const city = new City();
      city.x = cityData.x;
      city.y = cityData.y;
      this.cities.push(city);
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

    Ticker.shared.add(this.update, this);
  }

  update(framesPassed: number): void { }
}
