import levelData from '../data/1';
import { Level } from './levels/level';
import { Manager } from './manager';

Manager.initialize(1024, 768);
Manager.changeScene(new Level(Manager.app, levelData));
