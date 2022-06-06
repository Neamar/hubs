import { Level } from '../levels/level';

const COLORS = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff];
export class Player {
  public color: number;
  constructor(index: number, level: Level) {
    this.color = COLORS[index];
  }
}
