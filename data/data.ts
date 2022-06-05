export interface ILevelCityData {
  x: number;
  y: number;
  roads?: number[];
}

export interface ILevelData {
  cities: ILevelCityData[];
}
