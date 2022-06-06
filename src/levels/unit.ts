import { Sprite } from 'pixi.js';
import { Player } from '../players/player';
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
  private speed = 3;
  private player: Player;
  private capacity: number;

  constructor(from: City, road: Road, player: Player) {
    this.sprite.anchor.set(0.5, 0.5);
    this.from = from;
    this.player = player;
    this.sprite.tint = this.player.color;
    this.to = road.leadsTo(from);
    this.totalDistance = road.distance;
    const angle = road.angleFrom(from);
    this.sin = Math.sin(angle);
    this.cos = Math.cos(angle);
    this.sprite.x = from.x;
    this.sprite.y = from.y;
    this.capacity = road.capacity;

    const scale = this.capacity / 5;
    this.sprite.scale.x = scale;
    this.sprite.scale.y = scale;
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
      this.to.addUnits(this.capacity, this.player);
      this.sprite.destroy();
      return false;
    }

    this.sprite.x = this.from.x + this.currentDistance * this.cos;
    this.sprite.y = this.from.y + this.currentDistance * this.sin;

    return true;
  }
}
