import { BitmapFont, BitmapText, Container, Graphics, InteractionEvent } from 'pixi.js';
import { Road } from './road';
import { SelectionArrow } from './selectionArrow';

BitmapFont.from('arial', {
  fill: '#ffffff', // White, will be colored later
  fontFamily: 'Arial',
  fontSize: 15,
});

const IDLE = 0xffffff;
const HOVERED = 0xaa0000;
const CLICKED = 0x00aa00;

export class City extends Container {
  private graphics: Graphics;
  private text: BitmapText;
  private units = 50;
  private state: number = IDLE;
  private roads: Road[] = [];
  private arrows: SelectionArrow[] = [];

  constructor() {
    super();

    this.graphics = new Graphics();
    this.addChild(this.graphics);

    this.text = new BitmapText('0', {
      fontName: 'arial',
      fontSize: 15,
      tint: 0xff0000, // Here we make it red.
    });
    this.text.anchor.set(0.5);
    this.addChild(this.text);

    this.onDraw();
    // events that begin with "pointer" are touch + mouse
    this.on('pointertap', this.onPointerTap, this);
    this.on('mouseover', this.onMouseOver, this);
    this.on('mouseout', this.onMouseOut, this);
    this.interactive = true;
  }

  private onDraw() {
    this.graphics.clear();
    this.graphics.beginFill(this.state);
    this.graphics.lineStyle(1, 0x000000);
    this.graphics.drawCircle(0, 0, 25);
    this.graphics.endFill();

    this.text.text = this.units.toString();
  }
  private update(deltaTime: number): void { }

  private onPointerTap() {
    if (this.state === CLICKED) {
      return;
    }

    this.state = CLICKED;
    this.arrows = this.roads.map((road) => {
      const arrow = new SelectionArrow(this, road);
      this.addChildAt(arrow, 0);
      return arrow;
    });
    this.onDraw();
  }
  private onMouseOver() {
    this.state = HOVERED;
    this.onDraw();
  }
  private onMouseOut() {
    this.arrows.forEach((a) => a.destroy());
    this.arrows = [];
    this.state = IDLE;
    this.onDraw();
  }

  public addRoad(road: Road) {
    this.roads.push(road);
  }
}
