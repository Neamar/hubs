import { Container, IDestroyOptions, Sprite, Ticker } from 'pixi.js';
import { Group, Tween } from 'tweedle.js';
import { City } from './city';
import { Road } from './road';

const IDLE = 0;
const HOVERED = 1;
const CLICKED = 2;

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
    this.onDraw();
    this.rotation = road.angleFrom(from);
    this.interactive = true;

    const targetScale = road.length / this.width / 4;
    console.log(road.length, targetScale);
    this.scale.x = 0;
    this.scale.y = 0;

    new Tween(this.scale, this.group).to({ x: targetScale, y: 1 }, 500).start();
    Ticker.shared.add(this.update, this);
  }

  private onDraw() { }

  public override destroy(options?: IDestroyOptions | boolean) {
    Ticker.shared.remove(this.update, this);
    super.destroy(options);
  }
  private update(): void {
    this.group.update();
  }
}
