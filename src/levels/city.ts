import { BitmapFont, BitmapText, Container, Graphics } from 'pixi.js';
import { Player } from '../players/player';
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
  public static HOVERED = 0xe3756d;
  public static SELECTED = 0x00aa00;
  public static POTENTIAL_TARGET = 0x03fcdf;
  public static RADIUS = 25;

  public static PLAIN = 0;
  public static VILLAGE = 1;
  public static CITY = 1;
  public static CAPITAL = 5;

  public static OWNER_CHANGED = 'owner_changed';

  private graphics: Graphics;
  private text: BitmapText;
  private _units = 5;
  private _player?: Player;
  private roads: Road[] = [];
  private arrows: SelectionArrow[] = [];
  private connexions: Road[] = [];
  public state: number = City.DEFAULT;
  public type = City.PLAIN;

  constructor() {
    super();

    this.graphics = new Graphics();
    this.addChild(this.graphics);

    this.text = new BitmapText('0', {
      fontName: 'arial',
      fontSize: 15,
      tint: 0x000000,
    });
    this.text.anchor.set(0.5);
    this.addChild(this.text);
    this.units = 5;

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
      level.addMovingUnit(this, road);
    });
    this.units -= this.connexions.length;
  }

  private onDraw() {
    this.graphics.clear();
    this.graphics.beginFill(this.state === City.DEFAULT && this._player ? this._player.color : this.state);
    this.graphics.lineStyle(1, 0x000000);
    this.graphics.drawCircle(0, 0, City.RADIUS);
    this.graphics.endFill();
  }

  public get units() {
    return this._units;
  }

  public set units(units) {
    this._units = units;
    this.text.text = this.units.toString();
  }

  public addUnits(units: number, player: Player) {
    if (player === this.player) {
      this.units += units;
    } else {
      this.units -= units;
      if (this.units < 0) {
        this.units = -this.units;
        this.setPlayer(player);
      }
    }
  }

  public get player() {
    return this._player;
  }

  public setPlayer(player: Player) {
    this._player = player;
    this.connexions = [];
    this.onDraw();
    this.emit(City.OWNER_CHANGED);
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
