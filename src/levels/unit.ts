import { Sprite } from 'pixi.js';
import { City } from './city';
import { Road } from './road';

Sprite.from('unit.png');
export class Unit {
  private sprite: Sprite = Sprite.from('unit.png');
  private from: City;
  private to: City;
  private totalDistance: number;
  private sin: number;
  private cos: number;
  private currentDistance = 0;
  private speed = 1;

  constructor(from: City, road: Road) {
    this.sprite.anchor.set(0.5, 0.5);
    this.from = from;
    this.to = road.leadsTo(from);
    this.totalDistance = road.distance;
    const angle = road.angleFrom(from);
    this.sin = Math.sin(angle);
    this.cos = Math.cos(angle);
    this.sprite.x = from.x;
    this.sprite.y = from.y;
  }

  public getSprite() {
    return this.sprite;
  }

  /**
   * Return true if the unit should be destroyed.
   */
  public update() {
    this.currentDistance += this.speed;
    if (this.currentDistance >= this.totalDistance) {
      this.to.units += 1;
      this.to.drawUnitCount();
      this.sprite.destroy();
      return false;
    }

    this.sprite.x = this.from.x + this.currentDistance * this.cos;
    this.sprite.y = this.from.y + this.currentDistance * this.sin;

    return true;
  }
}
