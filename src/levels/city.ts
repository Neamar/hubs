import { BitmapFont, BitmapText, Container, Graphics } from 'pixi.js';
import { Player } from '../players/player';
import { assertExists } from '../utils/assert';
import { Level } from './level';
import { Road } from './road';
import { SelectionArrow } from './selectionArrow';

BitmapFont.from('arial', {
  fill: '#ffffff', // White, will be colored later
  fontFamily: 'Arial',
  fontSize: 15,
});

export enum CityState {
  DEFAULT = 0xffffff,
  HOVERED = 0xe3756d,
  SELECTED = 0x00aa00,
  POTENTIAL_TARGET = 0x03fcdf,
}

export enum CityEvent {
  OWNER_CHANGED = 'owner_changed',
}

export enum CityType {
  PLAIN = Number.POSITIVE_INFINITY,
  VILLAGE = 1000,
  CITY = 500,
  CAPITAL = 200,
}

export class City extends Container {
  public static RADIUS = 25;

  private graphics: Graphics;
  private text: BitmapText;
  private _units = 5;
  private _player?: Player;
  private roads: Road[] = [];
  private arrows: SelectionArrow[] = [];
  private connexions: Road[] = [];
  public state: number = CityState.DEFAULT;
  public type = CityType.VILLAGE;
  private timeTillLastSpawnedUnit = 0;

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

  public update(level: Level, deltaMS: number) {
    this.timeTillLastSpawnedUnit += deltaMS;
    if (this.timeTillLastSpawnedUnit >= this.type) {
      this.units++;
      this.timeTillLastSpawnedUnit -= this.type;
    }

    if (!this.connexions.length) {
      return;
    }
    // Sever existing connexions when empty
    if (this.connexions.length > this.units) {
      this.connexions = [];
      return;
    }

    this.connexions.forEach((road) => {
      level.addMovingUnit(this, road);
    });
    this.units -= this.connexions.length;
  }

  private onDraw() {
    this.graphics.clear();
    this.graphics.beginFill(this.state === CityState.DEFAULT && this._player ? this._player.color : this.state);
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
    this.emit(CityEvent.OWNER_CHANGED);
  }

  public stateSelected() {
    if (this.state === CityState.SELECTED) {
      return;
    }

    this.state = CityState.SELECTED;
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

    this.state = CityState.DEFAULT;
    this.onDraw();
  }

  public statePotentialTarget() {
    this.state = CityState.POTENTIAL_TARGET;
    this.onDraw();
  }

  private onMouseOver() {
    if (this.state === CityState.DEFAULT) {
      this.state = CityState.HOVERED;
      this.onDraw();
    }
  }
  private onMouseOut() {
    if (this.state === CityState.HOVERED) {
      this.stateDefault();
    }
  }

  public addRoad(road: Road) {
    this.roads.push(road);
  }

  public addConnexion(city: City) {
    const road = this.roads.find((r) => r.leadsTo(this) === city);
    assertExists(road);

    if (road.leadsTo(this).connexions.includes(road)) {
      return;
    }

    if (this.connexions.includes(road)) {
      this.connexions.splice(this.connexions.indexOf(road), 1);
    } else {
      this.connexions.push(road);
    }
  }
}
