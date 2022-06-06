export interface ILevelCityData {
  x: number;
  y: number;
  owner?: number;
  roads?: number[];
}

export interface ILevelData {
  players: number;
  cities: ILevelCityData[];
}
