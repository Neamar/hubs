import { BitmapFont, BitmapText, Container, Graphics } from 'pixi.js';
import { Level } from './level';
import { Road } from './road';
import { SelectionArrow } from './selectionArrow';

BitmapFont.from('arial', {
  fill: '#ffffff', // White, will be colored later
  fontFamily: 'Arial',
  fontSize: 15,
});

export class City extends Container {
  public static DEFAULT = 0xffffff;
  public static HOVERED = 0xaa0000;
  public static SELECTED = 0x00aa00;
  public static POTENTIAL_TARGET = 0x0000aa;
  public static RADIUS = 25;
  private graphics: Graphics;
  private text: BitmapText;
  public units = 50;
  private roads: Road[] = [];
  private arrows: SelectionArrow[] = [];
  private connexions: Road[] = [];
  public state: number = City.DEFAULT;

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

  public update(level: Level) {
    if (!this.connexions.length || this.connexions.length > this.units) {
      return;
    }
    this.connexions.forEach((road) => {
      level.addUnit(this, road);
    });
    this.units -= this.connexions.length;
    this.drawUnitCount();
  }

  private onDraw() {
    this.graphics.clear();
    this.graphics.beginFill(this.state);
    this.graphics.lineStyle(1, 0x000000);
    this.graphics.drawCircle(0, 0, City.RADIUS);
    this.graphics.endFill();

    this.drawUnitCount();
  }
  public drawUnitCount() {
    this.text.text = this.units.toString();
  }

  public stateSelected() {
    if (this.state === City.SELECTED) {
      return;
    }

    this.state = City.SELECTED;
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

    this.state = City.DEFAULT;
    this.onDraw();
  }

  public statePotentialTarget() {
    this.state = City.POTENTIAL_TARGET;
    this.onDraw();
  }

  private onMouseOver() {
    if (this.state === City.DEFAULT) {
      this.state = City.HOVERED;
      this.onDraw();
    }
  }
  private onMouseOut() {
    if (this.state === City.HOVERED) {
      this.stateDefault();
    }
  }

  public addRoad(road: Road) {
    this.roads.push(road);
  }

  public addConnexion(city: City) {
    const road = this.roads.find((r) => r.leadsTo(this) === city);
    if (road) {
      if (this.connexions.includes(road)) {
        this.connexions.splice(this.connexions.indexOf(road), 1);
      } else {
        this.connexions.push(road);
      }
    }
  }
}
