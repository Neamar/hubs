import levelData from '../data/1';
import { Level } from './levels/level';
import { Manager } from './manager';

Manager.initialize(640, 480, 0xAAAAAA);
Manager.changeScene(new Level(Manager.app, levelData));
