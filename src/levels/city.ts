import { BitmapFont, BitmapText, Container, Graphics, InteractionEvent, Sprite, Ticker } from 'pixi.js';

// If you need to know, this is the expensive part. This creates the font atlas
const bitmapFont = BitmapFont.from("arial", {
  fill: "#ffffff", // White, will be colored later
  fontFamily: "Arial",
  fontSize: 15
});

const IDLE = 0xFFFFFF;
const HOVERED = 0xAA0000;
const CLICKED = 0x00AA00;

export class City extends Container {
  private graphics: Graphics;
  private text: BitmapText;
  private units: number = 0;
  private state: number = IDLE
  constructor() {
    super();

    this.graphics = new Graphics();
    this.addChild(this.graphics);

    this.text = new BitmapText("0", {
      fontName: "arial",
      fontSize: 15,
      tint: 0xFF0000 // Here we make it red.
    });
    this.text.anchor.set(0.5)
    this.addChild(this.text);

    this.onDraw();
    // events that begin with "pointer" are touch + mouse
    this.on("pointertap", this.onPointerTap, this);
    this.on("mouseover", this.onMouseOver, this);
    this.on("mouseout", this.onMouseOut, this);
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
  private update(deltaTime: number): void {

  }

  private onPointerTap(e: InteractionEvent) {
    this.state = CLICKED;
    this.units = 50;
    this.onDraw();
  }
  private onMouseOver(e: InteractionEvent) {
    this.state = HOVERED;
    this.units = 75;
    this.onDraw();
  }
  private onMouseOut(e: InteractionEvent) {
    this.state = IDLE;
    this.units = 0;
    this.onDraw();
  }
}
