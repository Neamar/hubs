import { Graphics } from 'pixi.js';
import { City } from './city';

export class Road extends Graphics {
  private from: City;
  private to: City;
  constructor(fromCity: City, toCity: City) {
    super();

    this.from = fromCity;
    this.to = toCity;

    this.from.addRoad(this);
    this.to.addRoad(this);

    this.onDraw();
  }

  private onDraw() {
    this.clear();
    this.lineStyle(2, 0x000000);
    this.moveTo(this.from.x, this.from.y);
    this.lineTo(this.to.x, this.to.y);
  }

  /**
   * From a city, where is this road leading to?
   */
  public leadsTo(from: City) {
    return this.from === from ? this.to : this.from;
  }

  /**
   * From a city, what's the angle to the next city?
   */
  public angleFrom(from: City) {
    if (from === this.from) {
      return Math.atan2(this.to.y - this.from.y, this.to.x - this.from.x);
    } else {
      return Math.atan2(this.from.y - this.to.y, this.from.x - this.to.x);
    }
  }

  public get distance() {
    return Math.sqrt(Math.pow(this.from.x - this.to.x, 2) + Math.pow(this.from.y - this.to.y, 2));
  }
}
