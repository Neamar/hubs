import { CityType } from '../src/levels/city';
import { ILevelData } from './data';

const data: ILevelData = {
  players: 2,
  cities: [
    {
      x: 100,
      y: 100,
      owner: 0,
      type: CityType.CAPITAL,
    },
    {
      x: 600,
      y: 100,
      roads: [0],
      owner: 1,
    },
    {
      x: 600,
      y: 400,
    },
    {
      x: 100,
      y: 400,
      roads: [2],
    },
    {
      x: 300,
      y: 200,
      roads: [0],
      owner: 0,
    },
  ],
};

export default data;
