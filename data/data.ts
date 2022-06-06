import { CityType } from '../src/levels/city';

export interface ILevelCityData {
  x: number;
  y: number;
  owner?: number;
  roads?: number[];
  type?: CityType;
}

export interface ILevelData {
  players: number;
  cities: ILevelCityData[];
}
