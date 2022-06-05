import { BitmapFont, BitmapText, Container, Graphics, InteractionEvent } from 'pixi.js';
import { Road } from './road';
import { SelectionArrow } from './selectionArrow';

BitmapFont.from('arial', {
  fill: '#ffffff', // White, will be colored later
  fontFamily: 'Arial',
  fontSize: 15,
});

const DEFAULT = 0xffffff;
const HOVERED = 0xaa0000;
const SELECTED = 0x00aa00;
const POTENTIAL_TARGET = 0x0000aa;

export class City extends Container {
  public static RADIUS = 25;
  private graphics: Graphics;
  private text: BitmapText;
  private units = 50;
  private state: number = DEFAULT;
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
    this.on('mouseover', this.onMouseOver, this);
    this.on('mouseout', this.onMouseOut, this);
    this.interactive = true;
  }

  private onDraw() {
    this.graphics.clear();
    this.graphics.beginFill(this.state);
    this.graphics.lineStyle(1, 0x000000);
    this.graphics.drawCircle(0, 0, City.RADIUS);
    this.graphics.endFill();

    this.text.text = this.units.toString();
  }

  public stateSelected() {
    if (this.state === SELECTED) {
      return;
    }

    this.state = SELECTED;
    this.arrows = this.roads.map((road) => {
      const arrow = new SelectionArrow(this, road);
      this.addChildAt(arrow, 0);
      return arrow;
    });
    this.onDraw();
    this.roads.forEach((r) => r.leadsTo(this).statePotentialTarget());
  }

  public stateDefault() {
    if (this.arrows.length) {
      this.arrows.forEach((a) => a.destroy());
      this.roads.forEach((r) => r.leadsTo(this).stateDefault());
      this.arrows = [];
    }

    this.state = DEFAULT;
    this.onDraw();
  }

  public statePotentialTarget() {
    this.state = POTENTIAL_TARGET;
    this.onDraw();
  }

  private onMouseOver() {
    if (this.state === DEFAULT) {
      this.state = HOVERED;
      this.onDraw();
    }
  }
  private onMouseOut() {
    if (this.state === HOVERED) {
      this.stateDefault();
    }
  }

  public addRoad(road: Road) {
    this.roads.push(road);
  }
}
