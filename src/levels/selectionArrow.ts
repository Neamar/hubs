import { Container, IDestroyOptions, Sprite, Ticker } from 'pixi.js';
import { Group, Tween } from 'tweedle.js';
import { City } from './city';
import { Road } from './road';

Sprite.from('arrow.svg');
export class SelectionArrow extends Container {
  private sprite: Sprite;
  private group: Group = new Group();
  private from: City;
  private road: Road;
  constructor(from: City, road: Road) {
    super();

    this.from = from;
    this.road = road;
    this.sprite = Sprite.from('arrow.svg');
    this.sprite.anchor.set(0, 0.5);
    this.addChild(this.sprite);
    const angle = road.angleFrom(from);
    this.x = City.RADIUS * Math.cos(angle);
    this.y = City.RADIUS * Math.sin(angle);
    this.rotation = angle;
    this.interactive = true;

    const targetScale = 0.25;
    this.scale.x = 0.1;
    this.scale.y = 0.1;

    new Tween(this.scale, this.group).to({ x: targetScale, y: targetScale }, 500).start();
    Ticker.shared.add(this.update, this);
  }

  public override destroy(options?: IDestroyOptions | boolean) {
    Ticker.shared.remove(this.update, this);
    super.destroy(options);
  }
  private update(): void {
    this.group.update();
  }
}
